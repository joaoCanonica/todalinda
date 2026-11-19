// Marcador dos scripts que ainda não existem. Cada um nasce na sessão indicada.
// Sai com código 0 para não quebrar cadeias, mas avisa claramente.
const [nome = '?', sessao = '?'] = process.argv.slice(2);
console.warn(`[pendente] "${nome}" ainda não implementado (previsto para a sessão ${sessao}).`);
