# Configuração Segura do NPM Token para GitHub Packages

## ⚠️ AÇÃO URGENTE NECESSÁRIA

Um token de acesso do GitHub foi encontrado exposto no arquivo `.npmrc`. Este token precisa ser **revogado imediatamente** e substituído por uma configuração segura.

## 🚨 Passos de Segurança

### 1. Revogar Token Exposto (URGENTE!)

1. **Acesse:** https://github.com/settings/tokens
2. **Localize** o token que começa com `ghp_Q6lwI...`
3. **Click em "Delete"** ou "Revoke"
4. **Confirme** a revogação

⚠️ **IMPORTANTE:** Faça isso ANTES de commitar qualquer coisa!

### 2. Criar Novo Token Seguro

1. **Gere um novo token:** https://github.com/settings/tokens/new

2. **Configure o token:**
   ```
   Nome: NPM_TOKEN (ou GITHUB_PACKAGES_TOKEN)

   Expiration: 90 days (ou conforme política da empresa)

   Scopes necessários:
   ✅ read:packages    (para ler pacotes do GitHub Packages)
   ✅ repo             (se o pacote @vineco77/auth-lib estiver em repo privado)
   ```

3. **Click "Generate token"**

4. **COPIE O TOKEN** (você não verá novamente!)
   ```
   ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### 3. Adicionar Token como Secret no GitHub

1. **Acesse as configurações do repositório:**
   ```
   https://github.com/Luckmenez/11soat-node-orders/settings/secrets/actions
   ```

2. **Click "New repository secret"**

3. **Preencha:**
   - **Name:** `NPM_TOKEN`
   - **Value:** [cole o token que você copiou]

4. **Click "Add secret"**

### 4. Configurar Token Local (para desenvolvimento)

Para usar o token localmente em vez de hardcoded:

**Opção A - Variável de Ambiente (Recomendado):**

1. **Adicione ao seu `.zshrc` ou `.bashrc`:**
   ```bash
   echo 'export NPM_TOKEN=ghp_seu_token_aqui' >> ~/.zshrc
   source ~/.zshrc
   ```

2. **O `.npmrc` já está configurado para usar `${NPM_TOKEN}`**

**Opção B - `.npmrc` local na home:**

1. **Crie/edite `~/.npmrc`:**
   ```bash
   echo '@vineco77:registry=https://npm.pkg.github.com/' >> ~/.npmrc
   echo '//npm.pkg.github.com/:_authToken=ghp_seu_token_aqui' >> ~/.npmrc
   ```

2. **O `.npmrc` do projeto usa o token global automaticamente**

## ✅ Configuração Implementada

### Arquivo `.npmrc` (Atualizado)

```properties
@vineco77:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

**Mudanças:**
- ❌ Antes: Token hardcoded (INSEGURO!)
- ✅ Depois: Usa variável de ambiente `${NPM_TOKEN}` (SEGURO!)

### GitHub Actions Workflow (Atualizado)

```yaml
- name: Install dependencies
  run: npm ci
  env:
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}

- name: Run tests with coverage
  run: npm run test:cov
  env:
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**O que faz:**
- Injeta o secret `NPM_TOKEN` como variável de ambiente
- npm ci substitui `${NPM_TOKEN}` no `.npmrc` automaticamente
- Token nunca é exposto nos logs

## 📋 Checklist de Segurança

Antes de fazer push, verifique:

- [ ] ✅ Token antigo foi revogado no GitHub
- [ ] ✅ Novo token foi criado com scopes corretos
- [ ] ✅ Novo token foi adicionado como secret `NPM_TOKEN` no GitHub
- [ ] ✅ Token local configurado (variável de ambiente ou ~/.npmrc)
- [ ] ✅ Arquivo `.npmrc` usa `${NPM_TOKEN}` (não hardcoded)
- [ ] ✅ Workflow do GitHub Actions atualizado

## 🧪 Testando Localmente

Antes de fazer push, teste se funciona:

```bash
# 1. Limpar cache
rm -rf node_modules package-lock.json

# 2. Definir token (se ainda não estiver em ~/.zshrc)
export NPM_TOKEN=ghp_seu_novo_token

# 3. Instalar dependências
npm install

# 4. Deve funcionar sem erro 401!
```

## 🚀 Testando no GitHub Actions

Após adicionar o secret e fazer push:

1. **Vá para:** https://github.com/Luckmenez/11soat-node-orders/actions

2. **Verifique o workflow "SonarCloud Analysis":**
   - ✅ "Install dependencies" deve passar
   - ❌ Se falhar com 401, o secret não está configurado

3. **Se falhar:**
   - Verifique se o secret `NPM_TOKEN` existe
   - Verifique se o token não expirou
   - Verifique os scopes do token

## ⚠️ Problemas Comuns

### Erro 401 no GitHub Actions

```
npm error 401 Unauthorized - GET https://npm.pkg.github.com/...
npm error authentication token not provided
```

**Soluções:**
1. ✅ Secret `NPM_TOKEN` adicionado?
2. ✅ Nome do secret está correto? (case-sensitive!)
3. ✅ Token tem scope `read:packages`?
4. ✅ Token não expirou?

### Erro 401 localmente

```
npm error 401 Unauthorized
```

**Soluções:**
1. ✅ Variável `NPM_TOKEN` definida? (`echo $NPM_TOKEN`)
2. ✅ Token está correto?
3. ✅ `source ~/.zshrc` após adicionar a variável?

### Token não funciona

**Verifique:**
1. Token tem os scopes corretos (`read:packages`, `repo`)
2. Token não foi revogado
3. Repositório `@vineco77/auth-lib` existe e você tem acesso

## 🔒 Melhores Práticas

### DO ✅

1. **Use secrets do GitHub Actions** para tokens
2. **Use variáveis de ambiente** localmente
3. **Revogue tokens comprometidos** imediatamente
4. **Defina expiration** nos tokens (90 days recomendado)
5. **Use scopes mínimos** necessários
6. **Mantenha `.npmrc` no .gitignore** (já está!)

### DON'T ❌

1. **Nunca comite tokens** em arquivos
2. **Nunca compartilhe tokens** via chat/email
3. **Nunca use tokens pessoais** em CI/CD de produção
4. **Nunca crie tokens sem expiration**
5. **Nunca dê scopes desnecessários**

## 📝 Documentação Adicional

- [GitHub Packages Authentication](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [npm .npmrc Configuration](https://docs.npmjs.com/cli/v9/configuring-npm/npmrc)

## 🆘 Suporte

Se precisar de ajuda:

1. **Verifique os logs do GitHub Actions** para mensagens de erro específicas
2. **Consulte a documentação** do GitHub Packages
3. **Entre em contato** com o time que mantém `@vineco77/auth-lib`

---

**Última atualização:** Janeiro 2026
**Status de Segurança:** ⚠️ REQUER AÇÃO IMEDIATA
**Prioridade:** 🔴 CRÍTICA
