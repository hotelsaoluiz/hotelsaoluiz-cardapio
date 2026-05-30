const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// 1. Helper to parse .env file manually (zero external dependencies)
function loadEnv() {
  const envPath = path.join(__dirname, '.env')
  if (!fs.existsSync(envPath)) {
    console.error('Erro: Arquivo .env não encontrado na raiz do projeto! Crie-o primeiro.')
    process.exit(1)
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8')
  const env = {}
  envContent.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    if (match) {
      let value = match[2] ? match[2].trim() : ''
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1)
      env[match[1]] = value;
    }
  })
  return env
}

const env = loadEnv()
const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não definidos no seu arquivo .env!')
  process.exit(1)
}

console.log('Iniciando conexão com o Supabase:', supabaseUrl)
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 2. Full Parsed Menu Data Structure
const categoriesData = [
  { name: 'Bebidas', order: 1 },
  { name: 'Entradas & Petiscos', order: 2 },
  { name: 'Grelhados & Carnes', order: 3 },
  { name: 'Peixes & Frutos do Mar', order: 4 },
  { name: 'Massas & Risotos', order: 5 },
  { name: 'Sopas', order: 6 },
  { name: 'Lanches', order: 7 },
  { name: 'Sobremesas', order: 8 }
]

const productsData = {
  'Bebidas': [
    { name: 'Água mineral (com ou sem gás)', price: 5.00, subcategory: 'Refrigerantes, Águas & Sucos' },
    { name: 'Refrigerante (lata 350ml)', price: 7.00, subcategory: 'Refrigerantes, Águas & Sucos' },
    { name: 'Cerveja (Budwaiser, Spaten e Original 600ml)', price: 19.00, subcategory: 'Cervejas' },
    { name: 'Cerveja (Skol 600ml)', price: 17.00, subcategory: 'Cervejas' },
    { name: 'Cerveja preta (Brahma Malzebier lata 350ml)', price: 10.00, subcategory: 'Cervejas' },
    { name: 'Cerveja Heineken Long Neck', price: 14.00, subcategory: 'Cervejas' },
    { name: 'H2O (limão copo 400ml)', price: 8.00, subcategory: 'Refrigerantes, Águas & Sucos' },
    { name: 'Suco Natural (laranja ou abacaxi copo 400ml)', price: 12.00, subcategory: 'Refrigerantes, Águas & Sucos' },
    { name: 'Suco de Limão (copo 400ml)', price: 8.00, subcategory: 'Refrigerantes, Águas & Sucos' },
    { name: 'Caipira Morango', price: 26.00, subcategory: 'Coquetéis & Doses' },
    { name: 'Caipira Vodka', price: 25.00, subcategory: 'Coquetéis & Doses' },
    { name: 'Caipira Velho Barreiro', price: 20.00, subcategory: 'Coquetéis & Doses' },
    { name: 'Caipira Absolute', price: 30.00, subcategory: 'Coquetéis & Doses' },
    { name: 'Martini', price: 10.00, subcategory: 'Coquetéis & Doses' },
    { name: 'Campari', price: 10.00, subcategory: 'Coquetéis & Doses' },
    { name: 'Rum', price: 10.00, subcategory: 'Coquetéis & Doses' },
    { name: 'Vodca', price: 10.00, subcategory: 'Coquetéis & Doses' },
    { name: 'Gin', price: 10.00, subcategory: 'Coquetéis & Doses' },
    { name: 'Underberg', price: 10.00, subcategory: 'Coquetéis & Doses' },
    { name: 'Aperol Spritz (Aperol c/ espumante)', price: 35.00, subcategory: 'Coquetéis & Doses' },
    { name: 'Chivas (12 anos) - Importado', price: 20.00, subcategory: 'Uísques' },
    { name: 'Logan (12 anos) - Importado', price: 18.00, subcategory: 'Uísques' },
    { name: 'Johnnie Walker - Importado', price: 19.00, subcategory: 'Uísques' },
    { name: 'Old Eight - Nacional', price: 10.00, subcategory: 'Uísques' },
    { name: 'Freixenet (semi sec)', price: 109.00, subcategory: 'Espumantes' },
    { name: 'Freixenet Mia', price: 89.00, subcategory: 'Espumantes' },
    { name: 'Freixenet Gordon negro Brut', price: 109.00, subcategory: 'Espumantes' },
    { name: 'Chandon Extra Brut', price: 130.00, subcategory: 'Espumantes' },
    { name: '8 KM Cabernet Sauvignon - Importado', price: 58.00, subcategory: 'Vinhos' },
    { name: 'Casillero Del Diablo Cabernet - Importado', price: 109.00, subcategory: 'Vinhos' },
    { name: 'Casillero Del Diablo Sauvignon Blanc - Importado', price: 109.00, subcategory: 'Vinhos' },
    { name: 'Casillero Del Diablo Carmenere - Importado', price: 109.00, subcategory: 'Vinhos' },
    { name: 'Casillero Del Diablo Chardonnay - Importado', price: 109.00, subcategory: 'Vinhos' },
    { name: 'Gato Negro Cabernet Sauvignon - Importado', price: 89.00, subcategory: 'Vinhos' },
    { name: 'Gato Negro Merlot - Importado', price: 89.00, subcategory: 'Vinhos' },
    { name: 'Reservado Concha Y Toro Cabernet Sauvignon - Importado', price: 89.00, subcategory: 'Vinhos' },
    { name: 'Reservado Concha Y Toro Sauvignon Blanc - Importado', price: 89.00, subcategory: 'Vinhos' },
    { name: 'Don Laurindo Cabernet Sauvignon - Nacional', price: 104.00, subcategory: 'Vinhos' },
    { name: 'Don Laurindo Merlot - Nacional', price: 118.00, subcategory: 'Vinhos' },
    { name: 'Don Laurindo Tannat - Nacional', price: 120.00, subcategory: 'Vinhos' },
    { name: 'Don Laurindo Malbec - Nacional', price: 115.00, subcategory: 'Vinhos' },
    { name: 'Don Pedrito Cabernet Sauvignon - Nacional', price: 95.00, subcategory: 'Vinhos' },
    { name: 'Don Pedrito Malbec - Nacional', price: 99.00, subcategory: 'Vinhos' },
    { name: 'Don Pedrito Merlot - Nacional', price: 99.00, subcategory: 'Vinhos' },
    { name: 'Taça de Vinho Tinto Seco Colonial (300ml)', price: 18.00, subcategory: 'Vinhos' },
    { name: 'Taça de Vinho Tinto Suave Colonial (300ml)', price: 18.00, subcategory: 'Vinhos' },
    { name: 'Rutini Malbec - Argentino', price: 279.00, subcategory: 'Vinhos' },
    { name: 'DV Catena Malbec - Argentino', price: 199.00, subcategory: 'Vinhos' },
    { name: 'DV Catena Cabernet Malbec - Argentino', price: 179.00, subcategory: 'Vinhos' },
    { name: 'Angelica Zapata Cabernet - Argentino', price: 269.00, subcategory: 'Vinhos' },
    { name: 'Angelica Zapata Malbec - Argentino', price: 279.00, subcategory: 'Vinhos' },
    { name: 'Cordero com Piel de Lobo Malbec - Argentino', price: 79.00, subcategory: 'Vinhos' },
    { name: 'Cordero del Lobo Chardonnay - Argentino', price: 79.00, subcategory: 'Vinhos' },
    { name: 'Cordero Rose Malbec - Argentino', price: 79.00, subcategory: 'Vinhos' },
    { name: 'Perro Callejero Malbec - Argentino', price: 109.00, subcategory: 'Vinhos' },
    { name: 'La Linda Chardonnay - Argentino', price: 109.00, subcategory: 'Vinhos' },
    { name: 'La Linda Rose Malbec - Argentino', price: 109.00, subcategory: 'Vinhos' },
    { name: 'Latitude 33 Malbec - Argentino', price: 109.00, subcategory: 'Vinhos' }
  ],
  'Entradas & Petiscos': [
    { name: 'Pastéis Presunto e Queijo (6 unidades)', price: 9.00, subcategory: 'Pastéis & Bolinhos' },
    { name: 'Pastéis carne (6 unidades)', price: 16.00, subcategory: 'Pastéis & Bolinhos' },
    { name: 'Pastéis camarão (6 unidades)', price: 22.00, subcategory: 'Pastéis & Bolinhos' },
    { name: 'Bolinho de Peixe (5 unidades)', price: 9.50, subcategory: 'Pastéis & Bolinhos' },
    { name: 'Bolinho de Bacalhau (6 unidades)', price: 32.00, subcategory: 'Pastéis & Bolinhos' },
    { name: 'Picadinho de Filé', price: 45.00, subcategory: 'Porções & Fritas' },
    { name: 'Iscas de Frango a Milanesa', price: 30.00, description: '250g de iscas de frango a milanesa', subcategory: 'Porções & Fritas' },
    { name: 'Camarão a Milanesa', price: 89.00, subcategory: 'Pastéis & Bolinhos' },
    { name: 'Iscas de Peixe a Milanesa', price: 50.00, description: '350g de iscas de peixe a milanesa', subcategory: 'Pastéis & Bolinhos' },
    { name: 'Tilápia a Milanesa', price: 40.00, description: '350g de iscas de peixe a milanesa', subcategory: 'Pastéis & Bolinhos' },
    { name: 'Tábua de Frios', price: 50.00, description: 'Queijo, presunto, pepino, azeitona e salame', subcategory: 'Porções & Fritas' },
    { name: 'Batata Frita', price: 30.00, description: '300g de batata palito', subcategory: 'Porções & Fritas' },
    { name: 'Batata Frita c/ cheddar e bacon', price: 55.00, description: 'Batata palito, bacon e queijo cheddar', subcategory: 'Porções & Fritas' },
    { name: 'Arroz', price: 13.00, subcategory: 'Porções & Fritas' },
    { name: 'Feijão', price: 13.00, subcategory: 'Porções & Fritas' },
    { name: 'Ovo', price: 4.00, subcategory: 'Porções & Fritas' },
    { name: 'Batata frita (adicional)', price: 5.00, subcategory: 'Porções & Fritas' },
    { name: 'Mix de folhas * Empratado, porção p/1 pessoa', price: 19.00, description: 'Alface, rúcula, tomate e cebola roxa', subcategory: 'Saladas' },
    { name: 'Salada Caesar * Empratado, porção p/1 pessoa', price: 33.00, description: 'Frango grelhado, alface americana, uva passa, molho e croutons', subcategory: 'Saladas' },
    { name: 'Salpicão * Empratado, porção p/1 pessoa', price: 22.00, description: 'Frango desfiado, maionese, cenoura ralada, pimentões picados, batata palha, presunto e queijo', subcategory: 'Saladas' }
  ],
  'Grelhados & Carnes': [
    { name: 'Filé Acebolado', price: 65.00, description: 'Medalhões de filé (200g) com cebola grelhada, arroz, batata frita mix de folhas e ovo', subcategory: 'Grelhados & Carnes Vermelhas' },
    { name: 'Filé Grelhado', price: 58.00, description: 'Arroz, filé grelhado (200g), alface e tomate', subcategory: 'Grelhados & Carnes Vermelhas' },
    { name: 'Filé a Milanesa', price: 68.00, description: 'Filé a milanesa (200g), arroz, batata frita, mix de folhas e ovo', subcategory: 'Grelhados & Carnes Vermelhas' },
    { name: 'Filé a Parmegiana', price: 87.00, description: 'Filé empanado (200g), presunto, molho de tomate, queijo gratinado, arroz, batata frita', subcategory: 'Grelhados & Carnes Vermelhas' },
    { name: 'Tornedos de Filé', price: 85.00, description: 'Medalhões de filé (200g) envolto com tiras de bacon ao molho de vinho, arroz, batata frita', subcategory: 'Grelhados & Carnes Vermelhas' },
    { name: 'Medalhões de Filé', price: 77.00, description: 'Medalhões de filé (200g) envolto com tiras de bacon, arroz, batata frita', subcategory: 'Grelhados & Carnes Vermelhas' },
    { name: 'A La Minuta de Filé', price: 78.00, description: 'Filé grelhado (200g), arroz, feijão, batata frita, mix de folhas e ovo', subcategory: 'Grelhados & Carnes Vermelhas' },
    { name: 'Estrogonof de Filé', price: 81.00, description: 'Iscas de filé grelhado (250g), molho de strogonof, arroz e batata palha', subcategory: 'Grelhados & Carnes Vermelhas' },
    { name: 'Carreteiro de Charque', price: 55.00, description: 'Charque receita tradicional de carreteiro de charque. Servido na panela de ferro.', subcategory: 'Grelhados & Carnes Vermelhas' },
    { name: 'Carreteiro de Filé', price: 58.00, description: 'Iscas de filé, cebola, tomate, molho de tomate e arroz. Servido na panela de ferro.', subcategory: 'Grelhados & Carnes Vermelhas' },
    { name: 'Frango Grelhado', price: 45.00, description: 'Frango grelhado (200g), arroz branco, mix de folhas', subcategory: 'Aves / Frango' },
    { name: 'Frango a parmegiana', price: 69.00, description: 'Filé de frango (200g) empanado e frito, arroz, batata frita e mix de folhas', subcategory: 'Aves / Frango' },
    { name: 'Frango a milanesa', price: 48.00, description: 'Filé de frango (200g), arroz branco, alface e tomate', subcategory: 'Aves / Frango' },
    { name: 'A La minuta de Frango', price: 60.00, description: 'Filé de frango grelhado (200g), arroz, batata frita, feijão, mix de folhas e ovo', subcategory: 'Aves / Frango' },
    { name: 'Strogonof de Frango', price: 62.00, description: 'Iscas de frango (200g), arroz, batata palha e molho strogonof', subcategory: 'Aves / Frango' }
  ],
  'Peixes & Frutos do Mar': [
    { name: 'Salmão ao molho mostarda', price: 104.00, description: 'Salmão grelhado no azeite de oliva, acompanhado de molho de mostarda, mel e nata; batata elegante (com molho branco e queijo ralado gratinado) e arroz', subcategory: 'Salmão' },
    { name: 'Salmão ao molho maracujá', price: 92.00, description: 'Salmão grelhado com molho de maracujá, arroz e gratinado de batatas', subcategory: 'Salmão' },
    { name: 'Salmão ao molho alcaparras', price: 116.00, description: 'Salmão grelhado, molho com alcaparras (molho branco com alcaparras), champignon, batata souté e arroz', subcategory: 'Salmão' },
    { name: 'Tilápia a São Luiz', price: 72.00, description: 'Filé de tilápia a milanesa, cenoura, cebola, brócolis grelhados e arroz', subcategory: 'Tilápia' },
    { name: 'Tilápia a siciliana', price: 65.00, description: 'Filé de tilápia grelhado crisp de cebola (cebola meia lua frita), arroz e batata chips', subcategory: 'Tilápia' },
    { name: 'Traíra a São Luiz', price: 87.00, description: 'Filé de traíra a milanesa acompanhada de legumes cozidos, ovos e arroz.', subcategory: 'Traíra' },
    { name: 'Traíra a siciliana', price: 76.00, description: 'Filé de traíra frita, crisp de cebola (cebola meia lua frita), batata chips, molho com limão e arroz', subcategory: 'Traíra' },
    { name: 'Traíra ao molho escabeche', price: 73.00, description: 'Filé de traíra frita, arroz e molho ao escabeche (tomate e cebola)', subcategory: 'Traíra' },
    { name: 'Traíra ao molho de camarão', price: 113.00, description: 'Filé de traíra frita, de molho de camarão e arroz', subcategory: 'Traíra' }
  ],
  'Massas & Risotos': [
    { name: 'Espaguete á bolonhesa', price: 57.00, description: 'Espaguete artesanal, molho vermelho, queijo e iscas de filé', subcategory: 'Massas & Nhoques' },
    { name: 'Espaguete á Carbonara', price: 62.00, description: 'Espaguete artesanal, bacon, gemas, molho branco e parmesão', subcategory: 'Massas & Nhoques' },
    { name: 'Espaguete á São Luiz', price: 68.00, description: 'Espaguete artesanal, molho branco, com iscas de filé e champignon', subcategory: 'Massas & Nhoques' },
    { name: 'Espaguete ao funghi', price: 85.00, description: 'Espaguete artesanal, molho branco, funghi grelhado e iscas de filé', subcategory: 'Massas & Nhoques' },
    { name: 'Espaguete camarão', price: 92.00, description: 'Espaguete artesanal, molho branco, camarão grelhado', subcategory: 'Massas & Nhoques' },
    { name: 'Fettuccine São Luiz', price: 85.00, description: 'Fettuccine artesanal, rúcula, tomate seco, escalopes de filé e molho 4 queijos.', subcategory: 'Massas & Nhoques' },
    { name: 'Nhoque á bolonhesa', price: 65.00, description: 'Nhoque de batata, molho de tomate e carne', subcategory: 'Massas & Nhoques' },
    { name: 'Sorrentino de presunto e queijo', price: 65.00, description: 'Sorrentino de presunto e queijo e molho Rosse', subcategory: 'Sorrentinos & Raviolis' },
    { name: 'Sorrentino de presunto e queijo á bolonhesa', price: 70.00, description: 'Sorrentino de presunto e queijo, molho vermelho e iscas de filé', subcategory: 'Sorrentinos & Raviolis' },
    { name: 'Ravióli de Espinafre e Ricota', price: 70.00, description: 'Ravióli de espinafre e ricota flambado na manteiga com tempero verde', subcategory: 'Sorrentinos & Raviolis' },
    { name: 'Ravióli de Espinafre e Ricota á bolonhesa', price: 75.00, description: 'Ravióli de espinafre e ricota, molho vermelho e iscas de filé', subcategory: 'Sorrentinos & Raviolis' },
    { name: 'Risoto de Camarão * Empratado, porção p/1 pessoa', price: 62.00, description: 'Arroz arbóreo, cebola, alho poro, manteiga, parmesão, vinho branco e camarão grelhado', subcategory: 'Risotos' },
    { name: 'Risoto ao Funghi * Empratado, porção p/1 pessoa', price: 61.00, description: 'Arroz arbóreo, cebola, alho poro, manteiga, parmesão, vinho branco, Funghi e medalhões de filé grelhado', subcategory: 'Risotos' },
    { name: 'Risoto de abóbora cabotiá * Empratado, porção p/1 pessoa', price: 61.00, description: 'Arroz arbóreo, cebola, alho poro, manteiga, abóbora cabotiá, parmesão, vinho branco e medalhões de filé grelhado', subcategory: 'Risotos' },
    { name: 'Risoto de salmão e limão siciliano * Empratado, porção p/1 pessoa', price: 69.00, description: 'Arroz arbóreo, raspas de limão siciliano, salmão grelhado, cebola, alho poro, manteiga, palmito, parmesão, vinho branco', subcategory: 'Risotos' },
    { name: 'Risoto de rúcula c/ salmão * Empratado, porção p/1 pessoa', price: 69.00, description: 'Arroz arbóreo, rúcula, salmão grelhado, tomate seco, cebola, alho poro, manteiga, palmito, parmesão, vinho branco', subcategory: 'Risotos' },
    { name: 'Risoto de gorgonzola c/ filé * Empratado, porção p/1 pessoa', price: 64.00, description: 'Arroz arbóreo, cebola, alho poro, gorgonzola, manteiga, parmesão, vinho branco e filé grelhado', subcategory: 'Risotos' }
  ],
  'Sopas': [
    { name: 'Canja * Servido na sopeira, p/1 pessoa', price: 27.00, description: 'Arroz, frango, cenoura e batata', subcategory: 'Caldos & Sopas' },
    { name: 'Sopa de Capeletti * Servido na sopeira, p/1 pessoa', price: 33.00, description: 'Carne ou frango', subcategory: 'Caldos & Sopas' },
    { name: 'Sopa de Capeletti * Servido na sopeira, p/2 pessoas', price: 60.00, description: 'Carne ou frango', subcategory: 'Caldos & Sopas' }
  ],
  'Lanches': [
    { name: 'Bauru São Luiz', price: 44.00, description: 'Iscas de filé (200g), queijo, presunto, alface, tomate, milho, ervilha, Fritas e ovo', subcategory: 'Lanches & Torradas' },
    { name: 'Xis Bacon', price: 48.00, description: 'Bacon, presunto, queijo, milho, ervilha, tomate, alface, maionese, ovo', subcategory: 'Lanches & Torradas' },
    { name: 'Torrada Simples', price: 16.00, description: 'Presunto e queijo', subcategory: 'Lanches & Torradas' },
    { name: 'Torrada completa', price: 24.00, description: 'Presunto, queijo, tomate, alface, ovo', subcategory: 'Lanches & Torradas' },
    { name: 'Pizza Família', price: 70.00, description: 'Frango com requeijão, mussarela, calabresa, lombo com requeijão, bacon e cheddar', subcategory: 'Pizzas' },
    { name: 'Pizza Média', price: 58.00, description: 'Frango com requeijão, mussarela, calabresa, lombo com requeijão, bacon e cheddar', subcategory: 'Pizzas' },
    { name: 'Omelete de legumes', price: 27.00, subcategory: 'Omeletes' },
    { name: 'Omelete de presunto e queijo', price: 31.00, subcategory: 'Omeletes' },
    { name: 'Omelete de presunto, queijo e salaminho', price: 35.00, subcategory: 'Omeletes' }
  ],
  'Sobremesas': [
    { name: 'Pudim (leite, leite condensado e ovos)', price: 8.00, subcategory: 'Doces & Sobremesas' },
    { name: 'Petit gâteau c/ sorvete de creme', price: 25.00, subcategory: 'Doces & Sobremesas' }
  ]
}

// 3. Helper to generate slug from name
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

async function run() {
  try {
    let isAuthenticated = false

    // Check if key is secret/service_role (bypasses RLS)
    if (supabaseAnonKey.startsWith('sb_secret_')) {
      console.log('Chave do tipo SECRET detectada. A inserção ignorará as políticas RLS automaticamente.')
      isAuthenticated = true
    } else {
      console.log('Chave do tipo PUBLISHABLE detectada. Tentando autenticação como administrador...')
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'administrador@hotelsaoluiz.com',
        password: 'hslcardapio'
      })

      if (authError) {
        console.warn('Alerta: Não foi possível autenticar localmente:', authError.message)
        console.log('Dica: Certifique-se de criar o usuário "administrador@hotelsaoluiz.com" com a senha "hslcardapio" no painel Authentication do Supabase.')
        console.log('Continuando tentativa direta no banco de dados (pode falhar se RLS estiver ativo)...')
      } else {
        console.log('Autenticação de administrador realizada com sucesso! Token de sessão obtido.')
        isAuthenticated = true
      }
    }

    console.log('\n--- 0. LIMPANDO DADOS EXISTENTES (WIPE-AND-RESEED) ---')
    // We purge all existing data first to ensure no duplicates or orphaned categories/products remain
    const { error: clearProductsError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (clearProductsError) {
      console.warn('Alerta ao limpar produtos:', clearProductsError.message)
    } else {
      console.log('Tabela de produtos limpa com sucesso.')
    }

    const { error: clearCategoriesError } = await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (clearCategoriesError) {
      console.warn('Alerta ao limpar categorias:', clearCategoriesError.message)
    } else {
      console.log('Tabela de categorias limpa com sucesso.')
    }
    const categoryMap = {}

    for (const cat of categoriesData) {
      const slug = slugify(cat.name)
      
      // Check if category already exists to avoid duplicates
      const { data: existing, error: findError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (existing) {
        console.log(`[Categoria] "${cat.name}" já cadastrada. Pulando...`)
        categoryMap[cat.name] = existing.id
      } else {
        const { data: created, error: createError } = await supabase
          .from('categories')
          .insert([{ name: cat.name, slug, display_order: cat.order }])
          .select()
          .single()

        if (createError) {
          throw new Error(`Erro ao criar categoria "${cat.name}": ${createError.message}`)
        }
        console.log(`[Categoria] "${cat.name}" criada com sucesso!`)
        categoryMap[cat.name] = created.id
      }
    }

    console.log('\n--- 2. CADASTRANDO PRODUTOS ---')
    let totalInserted = 0

    for (const categoryName of Object.keys(productsData)) {
      const categoryId = categoryMap[categoryName]
      if (!categoryId) {
        console.warn(`Alerta: Categoria "${categoryName}" não encontrada no mapeamento. Pulando pratos...`)
        continue
      }

      const productsList = productsData[categoryName]
      console.log(`\nInserindo pratos para Categoria "${categoryName}" (total: ${productsList.length})...`)

      for (const prod of productsList) {
        // Check if product already exists to avoid duplication
        const { data: existing, error: findError } = await supabase
          .from('products')
          .select('*')
          .eq('name', prod.name)
          .eq('category_id', categoryId)
          .maybeSingle()

        if (existing) {
          console.log(`  [Produto] "${prod.name}" já cadastrado. Pulando...`)
          continue
        }

        const { error: insertError } = await supabase
          .from('products')
          .insert([{
            category_id: categoryId,
            name: prod.name,
            price: prod.price,
            description: prod.description || '',
            subcategory: prod.subcategory || '',
            available: true,
            display_order: 0
          }])

        if (insertError) {
          console.error(`  [Erro] Falha ao cadastrar "${prod.name}":`, insertError.message)
        } else {
          console.log(`  [Produto] "${prod.name}" cadastrado - R$ ${prod.price.toFixed(2)}`)
          totalInserted++
        }
      }
    }

    console.log(`\n🎉 SEEDING CONCLUÍDO COM SUCESSO!`)
    console.log(`Total de novas categorias inseridas/verificadas: ${categoriesData.length}`)
    console.log(`Total de novos produtos inseridos com sucesso: ${totalInserted}`)

  } catch (err) {
    console.error('\n❌ Erro fatal durante a carga de dados:', err.message)
  }
}

run()
