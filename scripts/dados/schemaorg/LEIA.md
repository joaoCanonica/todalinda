# Vocabulário schema.org (offline)

`schemaorg-30.1.ttl.gz`: o vocabulário oficial do schema.org, **versão 30.1**, em Turtle (gzip).
Origem: `https://schema.org/version/30.1/schemaorg-current-https.nt`, na conversão em Turtle do pacote npm
`@_linked/schema@1.9.2` (`lib/esm/data/schema.ttl`; o namespace aparece como `http://schema.org/`).
Licença do vocabulário: CC BY-SA 3.0 (schema.org).

Uso: `scripts/audit-seo.mjs` confere cada bloco JSON-LD do site contra este vocabulário (tipos existem,
propriedades valem para o tipo, valores no tipo esperado). É a validação que dá para rodar aqui, sem rede;
o validator.schema.org e o Rich Results Test do Google ficam para o preview publicado (docs/SEO_GEO.md).
