# Guia de Migração e Transferência de Contas - Cardápio HSL

Este guia técnico descreve o procedimento passo a passo e as melhores práticas para transferir com total segurança todo o ecossistema do **Cardápio HSL** (código, banco de dados, mídias e hospedagem) da sua conta atual para novas contas do **GitHub**, **Supabase** e **Cloudflare**.

---

## 📋 Lista de Preparação (Pré-requisitos)
Antes de iniciar a migração, certifique-se de que já criou as novas contas nas três plataformas:
- [ ] Nova conta no **GitHub**
- [ ] Nova conta no **Supabase**
- [ ] Nova conta no **Cloudflare**

---

## 🛠️ ETAPA 1: Migração do GitHub (Código-Fonte)

Existem duas formas de transferir o repositório. A **Opção A** é a ideal, pois preserva o histórico de commits, issues e redireciona automaticamente os links antigos.

### Opção A: Transferência Direta de Propriedade (Recomendada)
1. Faça login na conta **antiga** do GitHub e vá para a página do repositório: `https://github.com/brunoavila55/cardapio_hsl`.
2. No menu superior do repositório, clique em **Settings** (Configurações).
3. Role até o final da página (seção **Danger Zone**) e clique em **Transfer ownership** (Transferir propriedade).
4. Insira as seguintes informações:
   * **New owner's username or organization name:** O nome de usuário da sua **nova conta** do GitHub.
   * Confirme digitando o nome do repositório (`cardapio_hsl`) no campo exigido.
5. Acesse o e-mail da sua **nova conta** do GitHub, abra o convite enviado e clique em **Accept** para aceitar a transferência do repositório.
6. **Atualize o repositório local na sua máquina:** Abra o terminal na pasta do projeto (`c:\cardapio_hsl`) e execute o comando abaixo para apontar para a nova URL:
   ```bash
   git remote set-url origin https://github.com/NOVO_USUARIO/cardapio_hsl.git
   ```

### Opção B: Duplicação Manual para o Novo GitHub
Se preferir não transferir, você pode criar um novo repositório vazio na nova conta e subir o código atual:
1. Crie um repositório vazio chamado `cardapio_hsl` na sua **nova conta** do GitHub.
2. No terminal da sua pasta local (`c:\cardapio_hsl`), altere o remote e empurre as ramificações:
   ```bash
   git remote set-url origin https://github.com/NOVO_USUARIO/cardapio_hsl.git
   git push -u origin main
   ```

---

## 🗄️ ETAPA 2: Migração do Supabase (Banco de Dados e Imagens)

Para migrar o banco de dados, criaremos um novo projeto no Supabase, rodaremos a estrutura de tabelas, configuraremos as políticas de segurança (RLS) e alimentaremos os pratos de forma automática usando o seeder.

### 1. Criar o Novo Projeto no Supabase
1. Acesse o painel com a sua **nova conta** do Supabase e clique em **New Project**.
2. Defina o nome do projeto (ex: `cardapio-hsl`), defina uma senha forte para o banco de dados e selecione a região mais próxima (ex: `São Paulo - sa-east-1`).
3. Aguarde alguns minutos até que a infraestrutura do banco seja provisionada.

### 2. Criar as Tabelas e Relacionamentos (SQL)
1. No menu lateral esquerdo do novo projeto Supabase, acesse **SQL Editor** e clique em **New query**.
2. Cole o script SQL a seguir para criar as tabelas `categories` e `products` com a estrutura exata do sistema:

```sql
-- 1. Criar a tabela de categorias
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Criar a tabela de produtos (pratos)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    description TEXT DEFAULT '',
    image_url TEXT,
    available BOOLEAN DEFAULT true,
    subcategory TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
```
3. Clique no botão **Run** no canto inferior direito para executar o script.

### 3. Configurar as Políticas de Segurança (RLS)
Para garantir que os clientes leiam o cardápio livremente, mas apenas os administradores façam alterações, ative a segurança a nível de linha (RLS) rodando o seguinte script no SQL Editor:

```sql
-- Habilitar RLS em ambas as tabelas
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Criar política de leitura pública (Clientes/Hóspedes)
CREATE POLICY "Leitura pública de categorias" 
ON categories FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Leitura pública de produtos" 
ON products FOR SELECT 
TO anon, authenticated 
USING (true);

-- Criar política de escrita restrita aos administradores autenticados
CREATE POLICY "Escrita total de categorias por administradores" 
ON categories FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Escrita total de produtos por administradores" 
ON products FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
```
*Clique em **Run** para aplicar.*

### 4. Configurar o Storage de Imagens
O sistema de fotos dos pratos exige um balde de armazenamento público chamado `product-images`:
1. No menu lateral do Supabase, vá em **Storage**.
2. Clique em **New Bucket**.
3. Defina o nome como exatamente: `product-images`.
4. Marque a opção **Public bucket** (essencial para que as imagens carreguem no cardápio público).
5. Clique em **Save**.
6. **Políticas do Storage:** Para permitir o upload e limpeza de fotos no painel administrativo, clique em **Policies** (sob a seção do Storage) e adicione as seguintes regras para o balde `product-images`:
   * **Leitura (SELECT):** Permitir para todos (`Public` / `anon`).
   * **Escrita (INSERT/UPDATE/DELETE):** Permitir apenas para usuários autenticados (`authenticated`).

### 5. Configurar o Usuário do Painel Administrativo
Para conseguir fazer login no painel de administração da sua nova conta:
1. No menu lateral do Supabase, clique em **Authentication** -> **Users**.
2. Clique em **Add User** -> **Create User**.
3. Insira as credenciais padrão do seu seeder (ou as que você preferir):
   * **Email:** `administrador@hotelsaoluiz.com`
   * **Password:** *Defina uma senha forte de sua preferência*
4. Desmarque a opção "Auto-confirm user" se quiser enviar confirmação, ou deixe marcada para liberar o login imediatamente de forma direta.

### 6. Atualizar as Credenciais Locais no Projeto e Popular os Dados (Seeder)
1. Vá nas configurações do novo projeto Supabase (**Project Settings** -> **API**) e copie a **Project URL** e a **anon public API key**.
2. No seu computador, abra o arquivo `.env` (e o `.env.local` se existir) na pasta `c:\cardapio_hsl` e substitua as variáveis com os novos dados obtidos:
   ```env
   VITE_SUPABASE_URL=https://seu-novo-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-nova-chave-anonima-publica
   ```
3. Para reinserir de forma automática todas as categorias e pratos originais do hotel no novo banco de dados de uma só vez, abra o terminal no seu computador e execute:
   ```powershell
   node seeder.js
   ```
   *Pronto! Todo o cardápio original foi clonado e cadastrado no seu novo banco de dados!*

> [!NOTE]
> Se você já havia feito o upload de fotos personalizadas de pratos na conta antiga, você precisará reenviá-las através do painel administrativo ou fazer o download delas no painel antigo do Supabase Storage e arrastá-las para dentro do novo balde `product-images` no novo Supabase.

---

## ⚡ ETAPA 3: Migração do Cloudflare Pages (Hospedagem Live)

Para transferir o site no ar (Cloudflare Pages), você pode convidar a nova conta para gerenciar o projeto existente ou recriá-lo na nova conta de forma limpa.

### Opção A: Convite de Membro Admin (Mais rápida e sem downtime)
1. Faça login na conta **antiga** do Cloudflare.
2. No painel inicial, clique em **Manage Account** (Gerenciar Conta) -> **Members** (Membros) no menu lateral.
3. Clique em **Invite members** (Convidar membros).
4. Insira o e-mail da sua **nova conta** do Cloudflare.
5. Sob funções, conceda a permissão de **Super Administrator** ou **Administrator** e clique em **Invite**.
6. Acesse o e-mail da nova conta, aceite o convite e pronto: você poderá gerenciar a hospedagem e domínios direto pela nova conta!

### Opção B: Recriação Limpa na Nova Conta (Recomendada para desvincular 100%)
1. Acesse o painel da sua **nova conta** do Cloudflare.
2. No menu lateral esquerdo, vá em **Workers & Pages** -> **Overview** e clique em **Create application**.
3. Selecione a aba **Pages** e clique em **Connect to Git** (Conectar ao Git).
4. Siga as instruções em tela para autorizar o Cloudflare a ler a sua **nova conta do GitHub** e selecione o repositório `cardapio_hsl`.
5. **Configurações de Build:**
   * **Project name:** `cardapio-hsl` (ou o nome de sua preferência)
   * **Production branch:** `main`
   * **Framework preset:** Selecione **Vite** (caso não conste na lista, selecione *None* ou *Create React App*).
   * **Build command:** `npm run build`
   * **Build output directory:** `dist`
6. **Variáveis de Ambiente (CRÍTICO):**
   * Antes de clicar em salvar, role até a seção **Environment variables** e adicione as duas credenciais do seu **novo Supabase** para que o site no ar consiga se conectar ao novo banco de dados:
     * `VITE_SUPABASE_URL` = *Sua nova URL do Supabase*
     * `VITE_SUPABASE_ANON_KEY` = *Sua nova chave anônima do Supabase*
7. Clique em **Save and Deploy**.
8. **Configuração de Domínio Personalizado (opcional):**
   * Assim que o deploy for concluído, acesse a aba **Custom domains** no projeto das Pages, adicione o seu domínio (ex: `cardapiohotelsaoluiz.com.br`) e siga as instruções automáticas do Cloudflare para apontar o DNS.

---

## 🎉 Conclusão da Migração

Uma vez concluídos os passos acima, execute um build local final e o deploy para garantir a perfeita sincronia entre a sua máquina e os novos servidores:

```powershell
npm.cmd run deploy
```

> [!TIP]
> Parabéns! Suas contas do GitHub, Supabase e Cloudflare foram migradas com sucesso para a nova estrutura administrativa. O sistema agora opera de forma 100% autônoma e segura nas suas novas contas de propriedade definitiva!
