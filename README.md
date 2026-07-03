# 🐾 Sistema de Triagem Veterinária

É uma aplicação web que utiliza inteligência artificial para auxiliar na triagem inicial de casos veterinários.  
O sistema recebe informações sobre o animal e sintomas e gera uma análise estruturada contendo hipóteses iniciais, nível de urgência e recomendações de conduta.

---

## 🚀 Funcionalidades

- Cadastro de informações do paciente (animal)
- Envio de sintomas para análise por IA
- Geração automática de relatório clínico estruturado
- Classificação de urgência (baixo, moderado, alto, crítico)
- Interface simples e intuitiva

---

## 🧠 Tecnologias utilizadas

### Backend
- Node.js
- Express
- Dotenv
- CORS
- OpenRouter API (LLM)

### Frontend
- HTML5
- CSS3
- JavaScript

---

## 📁 Estrutura do projeto
sistema-triagem/
│
├── package.json
├── server.js
├── .env
│
└── public/
    ├── index.html
    ├── app.js
    └── style.css


---

## ⚙️ Instalação do projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/SEU_USUARIO/vetcare-ai.git

2. Entrar na pasta
cd vetcare-ai
3. Instalar dependências
npm install
4. Configurar variáveis de ambiente

Criar um arquivo .env na raiz do projeto:

OPENROUTER_API_KEY=sua_chave_aqui
▶️ Como executar o projeto
Iniciar servidor
npm start
Acessar no navegador
http://localhost:3000
🧪 Como usar
Preencha os dados do animal:
Nome
Espécie
Idade
Sintomas (obrigatório)
Observações
Clique em "Gerar análise"
Aguarde o processamento da IA
Visualize o relatório estruturado com:
Hipóteses iniciais
Nível de urgência
Recomendações
Encaminhamentos
⚠️ Observações importantes
Este projeto não substitui avaliação veterinária profissional
A IA fornece apenas triagem inicial
A qualidade da resposta depende das informações fornecidas
🔐 Segurança
A chave da API fica armazenada no backend (.env)
Não é exposta no frontend
Comunicação feita via servidor Express
📌 Objetivo do projeto

Este projeto foi desenvolvido com fins acadêmicos para demonstrar:

Integração com APIs de IA
Construção de backend com Express
Consumo de API via frontend
Estruturação de sistemas de triagem assistida por IA
