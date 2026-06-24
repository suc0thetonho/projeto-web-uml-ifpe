document.addEventListener('DOMContentLoaded', async () => {
    const spanAndamento = document.getElementById('count-andamento');
    const spanConcluido = document.getElementById('count-concluido');

    if (!spanAndamento || !spanConcluido) return;

    const result = await window.api.listarPpcs();

    if (!result.success) {
        spanAndamento.textContent = 'erro';
        spanConcluido.textContent = 'erro';
        return;
    }

    const ppcs = result.data || [];
    const andamento = ppcs.filter(p => p.status === 'EM_ANDAMENTO').length;
    const concluido = ppcs.filter(p => p.status === 'CONCLUIDO').length;

    spanAndamento.textContent = `${andamento} registro${andamento !== 1 ? 's' : ''}`;
    spanConcluido.textContent = `${concluido} registro${concluido !== 1 ? 's' : ''}`;
});
