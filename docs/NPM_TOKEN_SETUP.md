# Configuração do NPM Token para GitHub Packages

## 📋 Visão Geral

Este projeto usa o pacote privado `@vineco77/auth-lib` do GitHub Packages. Para instalar as dependências, você precisa de autenticação.

## 🔒 Segurança

- ✅ `.npmrc` está no `.gitignore` (nunca será commitado)
- ✅ Token pessoal fica apenas na sua máquina
- ✅ GitHub Actions usa secret `NPM_TOKEN` (configurado no repositório)
- ✅ Nenhum token é exposto no código

## 🛠️ Configuração Local

### Opção 1: Manter seu .npmrc atual (Recomendado)

Se você já tem um `.npmrc` funcionando localmente, **não precisa fazer nada!**

Seu `.npmrc` atual:
```properties
@vineco77:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=ghp_seu_token_pessoal
```

✅ **Está seguro!** O arquivo está no `.gitignore`.

### Opção 2: Criar novo .npmrc

Se você não tem um `.npmrc` ou precisa recriar:

1. **Copie o exemplo:**
   ```bash
   cp .npmrc.example .npmrc
   ```

2. **Edite o `.npmrc` e adicione seu token:**
   ```properties
   @vineco77:registry=https://npm.pkg.github.com/
   //npm.pkg.github.com/:_authToken=ghp_seu_token_pessoal_aqui
   ```

3. **Pronto!** Pode instalar as dependências:
   ```bash
   npm install
   ```

## 🤖 Configuração no GitHub Actions (CI/CD)

### Como Funciona

O workflow `.github/workflows/sonarcloud.yml` cria dinamicamente o `.npmrc` durante a execução:

```yaml
- name: Configure NPM for GitHub Packages
  run: |
    echo "@vineco77:registry=https://npm.pkg.github.com/" > .npmrc
    echo "//npm.pkg.github.com/:_authToken=${{ secrets.NPM_TOKEN }}" >> .npmrc

- name: Install dependencies
  run: npm ci
```

**Resultado:**
- ✅ `.npmrc` é criado apenas no runner do GitHub Actions
- ✅ Usa o secret `NPM_TOKEN` (configurado no repositório)
- ✅ Arquivo é destruído quando o job termina
- ✅ Token nunca aparece nos logs

### Configurar o Secret NPM_TOKEN

Se você é o administrador do repositório:

1. **Gere um token de acesso:**
   - Acesse: https://github.com/settings/tokens/new
   - **Nome:** `NPM_TOKEN` ou similar
   - **Scopes:**
     - ✅ `read:packages`
     - ✅ `repo` (se necessário)
   - **Expiration:** 90 days (ou conforme política)
   - Generate token e **copie**

2. **Adicione como secret no repositório:**
   - Vá em: https://github.com/Luckmenez/11soat-node-orders/settings/secrets/actions
   - Click "New repository secret"
   - **Name:** `NPM_TOKEN`
   - **Value:** [cole o token]
   - Add secret

3. **Pronto!** O GitHub Actions agora pode instalar dependências.

## 📁 Arquivos Relacionados

### `.npmrc` (Local - NÃO commitado)
```properties
@vineco77:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=ghp_seu_token_pessoal
```
**Status:** Ignorado pelo Git (`.gitignore` linha 57)

### `.npmrc.example` (Commitado)
```properties
@vineco77:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```
**Uso:** Template para novos desenvolvedores

### `.gitignore`
```
.npmrc
```
**Garante** que tokens pessoais nunca sejam commitados

## 🧪 Testando

### Localmente

```bash
# Limpar cache
rm -rf node_modules package-lock.json

# Instalar (deve funcionar se .npmrc está configurado)
npm install

# Se der erro 401, verifique seu token
cat .npmrc
```

### No GitHub Actions

1. **Faça push de qualquer commit**
2. **Vá para Actions:** https://github.com/Luckmenez/11soat-node-orders/actions
3. **Verifique o workflow "SonarCloud Analysis":**
   - ✅ "Install dependencies" deve passar
   - ❌ Se falhar com 401, o secret `NPM_TOKEN` não está configurado

## ⚠️ Troubleshooting

### Erro 401 Localmente

```
npm error 401 Unauthorized - GET https://npm.pkg.github.com/...
```

**Soluções:**
1. ✅ Verifique se `.npmrc` existe: `ls -la .npmrc`
2. ✅ Verifique se o token está correto
3. ✅ Gere um novo token se necessário
4. ✅ Verifique se tem acesso ao repositório `@vineco77/auth-lib`

### Erro 401 no GitHub Actions

```
npm error 401 Unauthorized
npm error authentication token not provided
```

**Soluções:**
1. ✅ Secret `NPM_TOKEN` existe? Verifique em Settings > Secrets
2. ✅ Nome do secret está correto? (case-sensitive: `NPM_TOKEN`)
3. ✅ Token tem scope `read:packages`?
4. ✅ Token não expirou?

### npm ci falha mas npm install funciona

Use `npm ci` sempre no CI/CD:
```bash
# Remove node_modules e package-lock.json
rm -rf node_modules package-lock.json

# Reinstala com npm install
npm install

# Agora npm ci deve funcionar
npm ci
```

## 🔐 Segurança - Boas Práticas

### DO ✅

1. **Mantenha `.npmrc` no `.gitignore`** (já está!)
2. **Use tokens com scopes mínimos** (`read:packages` apenas)
3. **Defina expiration nos tokens** (90 days recomendado)
4. **Use secrets do GitHub Actions** para CI/CD
5. **Revogue tokens comprometidos** imediatamente

### DON'T ❌

1. **Nunca comite `.npmrc`** com tokens
2. **Nunca compartilhe tokens** via chat/email
3. **Nunca use tokens pessoais** em produção/CI
4. **Nunca crie tokens sem expiration**
5. **Nunca dê scopes desnecessários** ao token

## 📚 Referências

- [GitHub Packages - npm](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [Authenticating to GitHub Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages)
- [npm .npmrc](https://docs.npmjs.com/cli/v9/configuring-npm/npmrc)

## 🆘 Precisa de Ajuda?

1. **Verifique os logs** do GitHub Actions para erros específicos
2. **Confirme que tem acesso** ao repositório `@vineco77/auth-lib`
3. **Entre em contato** com o time que mantém o pacote

---

**Última atualização:** Janeiro 2026
**Status:** ✅ Configurado e seguro
**Arquivo .npmrc:** Ignorado pelo Git (nunca commitado)
