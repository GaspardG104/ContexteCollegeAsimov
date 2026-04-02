function confirmDelete(id) {
    if (confirm("Voulez-vous vraiment supprimer ce projet ? Cette action est irréversible.")) {
        window.location.href = "/projets/delete/" + id;
    }
}