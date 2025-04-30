# PokemonAdventure_JourneyThroughPortugal
Jogo RPG em HTML5/Canvas onde exploras cidades de Portugal, capturas Pokémon e enfrentas líderes de ginásio, com gráficos em pixel art e combates por turnos.

---

## 🗺️ Estrutura de Ficheiros (VSCode)

pokemon-adventure/
│
├── index.html                  # Entrada principal do jogo
├── style.css                   # Estilos globais
├── main.js                     # Ponto de entrada da aplicação (inicializa o jogo)
├── gameConfig.json             # Configurações estáticas (mapa, atributos Pokémon, etc.)
│
├── /core                       # Núcleo do motor de jogo
│   ├── GameEngine.js           # Classe GameEngine: update, render, load
│   ├── InputHandler.js         # Classe InputHandler: teclas e comandos
│   ├── CollisionDetector.js    # Classe para colisões entre entidades
│   ├── BattleSystem.js         # Classe de combate por turnos
│   └── AI.js                   # Lógica de movimentação inteligente para NPCs
│
├── /entities                   # Entidades principais do jogo
│   ├── Player.js               # Classe Player
│   ├── NPC.js                  # Classe genérica de NPC
│   ├── Pokemon.js              # Classe base Pokémon (HP, CP, ataques)
│   ├── GymLeader.js            # Subclasse NPC para líderes de ginásio
│   └── Item.js                 # Classe de itens usáveis (Poções, Pokébolas)
│
├── /ui                         # Interface do jogo
│   ├── HUD.js                  # Classe HUD para mostrar HP, menus, etc.
│   ├── Menu.js                 # Menu de pausa, inventário, etc.
│   └── Notifications.js        # Sistema de mensagens em HTML (substitui alert)
│
├── /assets                     # Recursos visuais e sonoros
│   ├── /sprites                # Spritesheets
│   ├── /maps                   # Tiledmaps (JSON, TMX ou imagem)
│   └── /audio                  # Música de fundo e efeitos
│
├── /scenes                    # Diferentes cenas do jogo
│   ├── TitleScreen.js          # Menu inicial e créditos
│   ├── WorldMap.js             # Mundo superior com cidades e rotas
│   ├── BattleScene.js          # Cena de combate com interface
│   └── ShopScene.js            # Cena de compra de itens
│
└── README.md                   # Documentação do projeto

---

## ✅ Funcionalidades Confirmadas

- [x] Navegação em cidades portuguesas
- [x] Sistema de combate por turnos
- [x] Captura de Pokémon
- [x] Economia (dinheiro para comprar itens)
- [x] HUD com HP, Pokémon e opções
- [x] Gráficos em pixel art
- [x] Detecção de colisões e pathfinding (AI)
- [x] Mapa interativo e ligação entre cidades
- [x] Música e efeitos sonoros
- [x] Jogo offline com funcionalidades online

---

## 📋 Tarefas e Etapas

### 📅 Planeamento

| Etapa | Descrição | Responsável | Status |
|-|-|-|-|
| 1 | Blueprint / Storyboard / GUIA | [António] | ⬜ |
| 2 | Recolha de sprites/audio (livre uso) | [António] | ⬜ |
| 3 | Programação do motor base (`GameEngine.js`) | [Rodrigo] | ⬜ |
| 4 | Sistema de colisão entre jogador, NPCs e obstáculos | [Rodrigo] | ⬜ |
| 5 | Implementação de pathfinding simples para NPCs | [Rodrigo] | ⬜ |
| 6 | Implementação do sistema de combate por turnos | [Rodrigo] | ⬜ |
| 7 | Design de atributos dos Pokémon (CP, HP, ataques, tipos) | [António] | ⬜ |
| 8 | Lógica de evolução e progressão dos Pokémon | [Rodrigo] | ⬜ |
| 9 | Criação do mapa de cidades (tiledmap) | [António] | ⬜ |
|10 | HUD com status do Pokémon, inventário e menus | [António] | ⬜ |
|11 | Loja de itens e sistema de dinheiro | [Rodrigo] | ⬜ |
|12 | Integração de música/sons | [António] | ⬜ |
|13 | Créditos e menu inicial | [Rodrigo] | ⬜ |
|14 | Testes e balanceamento do combate | Todos | ⬜ |
|15 | Testes finais e correção de bugs | Todos | ⬜ |
|16 | Relatório final + entrega | Todos | ⬜ |

### Dependencias de cada uma das tarefas 


## 🔵 Etapas Iniciais

### #1 - Definição do Tema
- Descrição: Escolha e definição do tema do jogo pelo grupo.
- Dependências: Nenhuma

### #2 - Criação do Storyboard / Blueprint / GUIA
- Descrição: Documento de planeamento visual e mecânico do jogo.
- Depende de: #1

### #3 - Recolha de Sprites, Áudio e Recursos Visuais
- Descrição: Obtenção de elementos gráficos e sonoros com licença livre.
- Depende de: #2 (parcialmente)

### #4 - Programação do Motor Base (`GameEngine.js`)
- Descrição: Criar a estrutura base do jogo: loop, entidades, render, etc.
- Depende de: #2

### #5 - Criação do Mapa de Cidades (Tiledmap)
- Descrição: Design do mapa com rotas, cidades e ligação entre zonas.
- Depende de: #2

---

## 🟡 Mecânicas Essenciais

### #6 - Implementação de Colisões
- Descrição: Deteção de colisão com NPCs, objetos e limites.
- Depende de: #4, #5

### #7 - Pathfinding de NPCs
- Descrição: Movimento inteligente dos NPCs com navegação básica.
- Depende de: #6

### #8 - Sistema de Combate por Turnos
- Descrição: Combates com lógica de turnos, seleção de ataques e animações.
- Depende de: #4

### #9 - Design de Atributos dos Pokémon (HP, CP, tipos)
- Descrição: Criação da estrutura de dados dos Pokémon e seus atributos.
- Depende de: Nenhuma (pode ser paralela à #8)

### #10 - Lógica de Evolução e Progressão dos Pokémon
- Descrição: Regras de evolução e upgrade dos Pokémon.
- Depende de: #8, #9

---
## 🟠 Interface e Conteúdo

### #11 - HUD e Menus (Pokémon, Itens, HP, Inventário)
- Descrição: Interface com status dos Pokémon, menus e inventário.
- Depende de: #8, #9

### #12 - Loja e Sistema de Dinheiro
- Descrição: Comprar itens, ganhar dinheiro com vitórias.
- Depende de: #8

### #13 - Música de Fundo e Efeitos Sonoros
- Descrição: Integração de som ambiente, ataques e menus

---

## 🔴 Etapas Finais

### #14 - Ecrã Inicial, Créditos e Menu Principal
- Descrição: Tela de início do jogo, créditos aos autores e menus.
- Depende de: Nenhuma

### #15 - Testes e Balanceamento do Combate
- Descrição: Ajustar atributos, dificuldade e equilíbrio do sistema de combate.
- Depende de: #8, #9, #10

### #16 - Testes Finais e Correção de Bugs
- Descrição: QA final e ajustes para garantir que tudo funciona bem.
- Depende de: #6, #7, #8, #11, #12

### #17 - Elaboração do Relatório Final
- Descrição: Escrever o relatório conforme o modelo fornecido no PDF.
- Depende de: #16

---

## 💻 Tecnologias Usadas

- HTML5 + Canvas
- CSS3
- JavaScript (ES6+)
- JSON (para configurações e dados)
- Framework: [`extend.js`](http://extendjs.org/)

---

## 📦 Dependências (se aplicável)

- Nenhuma externa obrigatória. Todo o código em JS puro.
- Spritesheets e áudio: [Licença Creative Commons]

---

## ℹ️ Notas Importantes

- **Evitar `alert()` – usar sistema de notificações HTML**
- **Creditar todas as fontes de imagens/áudio**
- **Orientação a Objetos obrigatória**
- **Entregar relatório + código + apresentação oral**

---

## 📍 Créditos

Sprites, músicas e tilesheets obtidos de fontes livres (ver painel de créditos no jogo).

---