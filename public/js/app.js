let currentUser = null;
let todoTable = null;
let isRegisterMode = false;
let currentEditId = null;

$(document).ready(function() {
    checkAuth();
    setupEventListeners();
});

function setupEventListeners() {
    window.switchView = function(view) {
        $('.view-section').addClass('d-none');
        $('.list-group-item').removeClass('active');

        let viewId = view + '-view';
        if (['inbox', 'today', 'upcoming', 'completed'].includes(view)) {
            viewId = 'tasks-view';
            if (view === 'inbox') {
                $('#tasks-page-title').text('Inbox');
                $('#tasks-page-subtitle').text('Capture everything, organize later.');
            } else {
                $('#tasks-page-title').text(view.charAt(0).toUpperCase() + view.slice(1));
                $('#tasks-page-subtitle').text('Filtering view for ' + view + '.');
            }
            if (typeof fetchAndRenderTasks === 'function') fetchAndRenderTasks();
        }

        $(`#${viewId}`).removeClass('d-none');

        if (view === 'statistics' || view === 'dashboard') {
            $('#nav-stats').addClass('active');
            initCharts();
            updateStats();
        } else if (view === 'profile' || view === 'account-settings') {
            $('#nav-profile').addClass('active');
            $('#current-view-title').text('Account Settings');
        } else if (view === 'notifications-settings') {
            $('.list-group-item:contains("Notifications")').addClass('active');
            $('#current-view-title').text('Notification Settings');
        } else if (view === 'integrations') {
            $('.list-group-item[onclick*="integrations"]').addClass('active');
            $('#current-view-title').text('Workspace Integrations');
        } else {
            $(`.list-group-item[onclick*="${view}"]`).addClass('active');
            $('#current-view-title').text(view.charAt(0).toUpperCase() + view.slice(1));
        }
    };

    window.showAuth = function(mode) {
        $('#landing-page').addClass('d-none');
        $('#auth-container').removeClass('d-none');
        if (mode === 'signup' && $('#auth-container').hasClass('login-mode')) $('#toggle-auth').click();
        if (mode === 'login' && !$('#auth-container').hasClass('login-mode')) $('#toggle-auth').click();
    };

    $('#toggle-auth').on('click', function(e) {
        e.preventDefault();
        $('#auth-error').addClass('d-none');
        const isLogin = $('#auth-title').text().includes('Sign In');
        if (isLogin) {
            $('#auth-container').removeClass('login-mode');
            $('#auth-title').text('Create your workspace');
            $('#register-fields').removeClass('d-none');
            $('#auth-form button[type="submit"]').text('Initialize Account');
            $('#auth-switch-text').text('Already have an account?');
            $('#toggle-auth').text('Sign In');
            isRegisterMode = true;
        } else {
            $('#auth-container').addClass('login-mode');
            $('#auth-title').text('Sign In');
            $('#register-fields').addClass('d-none');
            $('#auth-form button[type="submit"]').text('Authenticate Instance');
            $('#auth-switch-text').text('New to the platform?');
            $('#toggle-auth').text('Initialize Account');
            isRegisterMode = false;
        }
    });

    $('#auth-form').on('submit', async function(e) {
        e.preventDefault();
        $('#auth-error').addClass('d-none');
        const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
        const data = {
            email: $('#email').val(),
            password: $('#password').val(),
            username: $('#username').val() || "Anonymous"
        };

        try {
            const resp = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await resp.json();
            if (resp.ok) {
                localStorage.setItem('token', result.token);
                checkAuth();
            } else {
                $('#auth-error').removeClass('d-none');
                $('#auth-error-text').text(result.message || 'Authentication failed.');
            }
        } catch (err) { 
            console.error(err);
            $('#auth-error').removeClass('d-none');
            $('#auth-error-text').text('System error occurred.');
        }
    });

    $('#logout-btn').on('click', function() {
        localStorage.removeItem('token');
        location.reload();
    });

    $('#add-intent-form').on('submit', async function(e) {
        e.preventDefault();
        $('#task-error').addClass('d-none');
        
        if (!this.checkValidity()) {
            e.stopPropagation();
            $(this).addClass('was-validated');
            return;
        }
        $(this).removeClass('was-validated');

        const data = {
            title: $('#intent-title').val(),
            description: $('#intent-desc').val(),
            startDate: $('#intent-date').val(),
            priority: $('input[name="priority"]:checked').val(),
            status: 'pending'
        };

        const externalBtn = $('button[form="add-intent-form"]');
        const originalText = externalBtn.html();
        externalBtn.html('<span class="spinner-border spinner-border-sm me-2"></span>Processing...').prop('disabled', true);

        try {
            const resp = await fetch('/api/todos', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            });
            if (resp.ok) {
                if (taskModalInstance) taskModalInstance.hide();
                fetchAndRenderTasks();
                updateStats();
                switchView('inbox');
                
                const originalBtnStyles = externalBtn.attr('class');
                externalBtn.html('<i class="bi bi-check-circle-fill"></i> Saved Successfully').addClass('bg-success text-white');
                setTimeout(() => {
                    externalBtn.html(originalText).attr('class', originalBtnStyles);
                }, 2000);
            } else {
                const errData = await resp.json();
                $('#task-error').removeClass('d-none');
                $('#task-error-text').text('Failed to construct intent: ' + errData.message);
            }
        } catch (err) { 
            console.error(err);
            $('#task-error').removeClass('d-none');
            $('#task-error-text').text('Critical error while saving task.');
        } finally {
            externalBtn.html(originalText).prop('disabled', false);
        }
    });
}

function checkAuth() {
    let token = localStorage.getItem('token');
    if (token === 'undefined') {
        localStorage.removeItem('token');
        token = null;
    }
    if (token) {
        $('#landing-page').addClass('d-none');
        $('#auth-container').addClass('d-none');
        $('#app-container').removeClass('d-none');
        fetchAndRenderTasks();
        updateStats();
    } else {
        $('#landing-page').removeClass('d-none');
        $('#auth-container').addClass('d-none');
        $('#app-container').addClass('d-none');
    }
}

let taskModalInstance = null;
function openCreateModal() {
    currentEditId = null;
    $('#add-intent-form')[0].reset();
    $('#add-intent-form').removeClass('was-validated');
    if (!taskModalInstance) {
        taskModalInstance = new bootstrap.Modal(document.getElementById('addTaskModal'));
    }
    taskModalInstance.show();
}



function openSettingsModal() {
    const modal = new bootstrap.Modal(document.getElementById('profileSettingsModal'));
    modal.show();
}

async function saveProfileSettings() {
    const data = {
        name: $('#settings-name').val(),
        title: $('#settings-title').val(),
        bio: $('#settings-bio').val()
    };
    console.log('Profile saved', data);
    bootstrap.Modal.getInstance(document.getElementById('profileSettingsModal')).hide();
    alert('Architecture updated!');
}

async function fetchAndRenderTasks() {
    try {
        const resp = await fetch('/api/todos', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const todos = await resp.json();
        
        let filteredTodos = todos;
        const currentView = $('#tasks-page-title').text().toLowerCase();
        if (currentView === 'completed') {
            filteredTodos = todos.filter(t => t.status === 'completed');
        } else if (currentView === 'today') {
            filteredTodos = todos.filter(t => t.status !== 'completed');
        }

        const container = $('#todo-list-container');
        container.empty();

        if (filteredTodos.length === 0) {
            container.html('<div class="text-center p-5 text-muted"><p class="fw-bold fs-5">No items found.</p></div>');
            return;
        }

        filteredTodos.forEach(row => {
            const isCompleted = row.status === 'completed';
            const p = row.priority || 'low';
            const dateStr = row.startDate ? new Date(row.startDate).toLocaleDateString() : 'Added recently';
            
            let pIcon = '', pText = '';
            if(p === 'high') { pIcon = '<i class="bi bi-exclamation-lg"></i>'; pText = 'High Priority'; }
            if(p === 'mid') { pIcon = '<i class="bi bi-dash"></i>'; pText = 'Mid Priority'; }
            
            const checkHTML = isCompleted 
                ? `<div class="bg-primary-blue rounded d-flex align-items-center justify-content-center shadow-sm" style="width: 24px; height: 24px; border: 2px solid var(--primary-blue); cursor:pointer; background-color: var(--primary-blue);" onclick="toggleTask('${row._id}', '${row.status}')"><i class="bi bi-check text-white fs-5"></i></div>`
                : `<div class="bg-white rounded shadow-sm" style="width: 24px; height: 24px; border: 2px solid #ced4da; cursor:pointer;" onclick="toggleTask('${row._id}', '${row.status}')"></div>`;
            
            const titleClass = isCompleted ? 'opacity-50 text-decoration-line-through' : '';

            const metaHTML = `
                <div class="d-flex align-items-center gap-3 mt-2">
                    <span class="badge rounded-pill bg-primary-soft text-primary-blue px-3 py-1 fw-bold" style="font-size: 0.70rem;">#INTENT</span>
                    <span class="text-muted small fw-semibold d-flex align-items-center gap-1"><i class="bi bi-clock-fill opacity-50"></i> ${dateStr}</span>
                    ${p === 'low' || isCompleted ? '' : `<span class="text-muted small fw-semibold d-flex align-items-center gap-1 mx-2 border-start ps-3">${pIcon} ${pText}</span>`}
                </div>
            `;

            const cardHTML = `
            <div class="card border-0 shadow-sm rounded-4">
                <div class="card-body p-4 d-flex align-items-start gap-4">
                    <div class="pt-1">${checkHTML}</div>
                    <div>
                        <h5 class="fw-bold mb-0 text-dark ${titleClass}" style="letter-spacing: -0.01em;">${row.title}</h5>
                        ${metaHTML}
                    </div>
                </div>
            </div>`;
            container.append(cardHTML);
        });
    } catch (err) { console.error('Render Error', err); }
}

async function updateStats() {
    try {
        const resp = await fetch('/api/todos', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const todos = await resp.json();
        const completed = todos.filter(t => t.status === 'completed').length;
        const total = todos.length;
        const efficiency = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;

        $('#stat-completedCount').text(completed);
        $('#stat-efficiencyScore').text(efficiency + '%');
        
        const circle = $('.circular-chart .circle');
        if (circle.length) {
            const dashArray = `${efficiency}, 100`;
            circle.attr('stroke-dasharray', dashArray);
        }

        let rank = 'C';
        if (efficiency >= 90) rank = 'AA+';
        else if (efficiency >= 75) rank = 'A';
        else if (efficiency >= 50) rank = 'B';
        $('.efficiency-rank').text(rank);

    } catch (err) { console.error('Stats Update Error', err); }
}

function initCharts() {
}

window.toggleTask = async function(id, currentStatus) {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
        const resp = await fetch(`/api/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        if(resp.ok) {
            fetchAndRenderTasks();
            updateStats();
        }
    } catch(err) { console.error('Toggle Error', err); }
};

window.cleanUpTasks = async function() {
    try {
        const resp = await fetch('/api/todos', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const todos = await resp.json();
        const completed = todos.filter(t => t.status === 'completed');
        for (const t of completed) {
            await fetch(`/api/todos/${t._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
        }
        fetchAndRenderTasks();
        updateStats();
    } catch(err) { console.error('Cleanup Error', err); }
};
