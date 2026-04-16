---
trigger: always_on
---

## Regras gerais

- **SEMPRE** use o pnpm para instalar pacotes e libs.
- **SEMPRE** use o comando `pnpm build` para garantir que o código não quebrou.
- **SEMPRE** use o comando `npx eslint . --fix` para garantir que o código está conforme ao linting da aplicação, e caso haja algum erro no comando, corrija-os.
- **NUNCA** modifique o comportamento de uma rota sem antes ler sua implementação completa.
- **NUNCA** remova um campo de retorno sem verificar se ele é consumido por algum cliente.
- **SEMPRE** leia a documentação oficial via context7 antes de implementar qualquer lib
  (Prisma, Zod v4, Fastify, ioredis, bullmq etc).
- **SEMPRE** valide o impacto de cada mudança no TypeScript antes de passar para o próximo passo.
- Execute os passos **em ordem**. Cada passo pode depender do anterior.
- Ao final de cada passo, registre o que foi alterado, o que foi ignorado e o motivo.
