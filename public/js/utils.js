async function openCreateModal() {
    currentEditId = null;
    $('#add-intent-form')[0].reset();
    const modal = new bootstrap.Modal(document.getElementById('addTaskModal'));
    modal.show();
}

async function saveNewIntent() {
    const data = {
        title: $('#intent-title').val(),
        description: $('#intent-desc').val(),
        startDate: $('#intent-date').val(),
        priority: $('input[name="priority"]:checked').val(),
        status: 'pending'
    };

    try {
        const resp = await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (resp.ok) {
            bootstrap.Modal.getInstance(document.getElementById('addTaskModal')).hide();
            if (todoTable) todoTable.ajax.reload();
            updateStats();
        }
    } catch (err) {
        console.error('Save error', err);
    }
}

function openSettingsModal() {
    const modal = new bootstrap.Modal(document.getElementById('profileSettingsModal'));
    modal.show();
}

async function saveProfileSettings() {
    const data = {
        name: $('#settings-name').val(),
        title: $('#settings-title').val(),
        bio: $('#settings-bio').val(),
        email: $('#settings-email').val(),
        password: $('#settings-pass').val()
    };

    try {
        console.log('Updating profile with:', data);
        bootstrap.Modal.getInstance(document.getElementById('profileSettingsModal')).hide();
        // Update UI elements
        $('.user-avatar img').attr('src', 'https://i.pravatar.cc/150?u=julian');
        alert('Architecture updated successfully!');
    } catch (err) {
        console.error('Profile update error', err);
    }
}
