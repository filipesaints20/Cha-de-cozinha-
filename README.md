# Chá de Cozinha — Lista de Presentes (simples)

Site simples em HTML/CSS/JS para gerir reservas de presentes.

## Arquivos
- `index.html` — página principal
- `styles.css` — estilos
- `app.js` — lógica (login, reservas, persistência)
- `README.md` — este ficheiro

## Como usar localmente
1. Crie uma pasta e coloque `index.html`, `styles.css` e `app.js`.
2. Abra `index.html` no navegador.
3. Faça login com qualquer email e a **senha genérica**: `cha2025`.
4. A lista de itens aparece; clique em **Vou comprar**, preencha nome + email e confirme.
5. Os dados são guardados no `localStorage` do navegador (persistem no mesmo browser).

## Configurações importantes
- Edite `app.js` e defina:
  - `ORGANIZER_WHATSAPP` — número do organizador em formato internacional (ex: `5511999998888`).
  - `ORGANIZER_EMAIL` — email do organizador para `mailto:`.
- Senha padrão: `cha2025`. Mude `GENERIC_PASSWORD` em `app.js` se desejar outra.

## Publicar no GitHub Pages
1. Crie repositório no GitHub.
2. Faça commit dos ficheiros (`index.html`, `styles.css`, `app.js`, `README.md`).
3. Vá a **Settings > Pages** no repositório e selecione branch `main` (ou `gh-pages`) e root `/`.
4. Aguarde alguns minutos; o site ficará disponível em `https://<seu-usuario>.github.io/<seu-repo>/`.

## Firebase (opcional) — persistência entre visitantes
1. Crie projeto no Firebase (console.firebase.google.com).
2. Ative Firestore Database.
3. Copie `firebaseConfig` para `app.js` e implemente leitura/gravação em vez de `localStorage`.
4. Configure regras de segurança e Auth se necessário.

## Notas de segurança
- Este protótipo usa **senha genérica** e `localStorage` — não é seguro para dados sensíveis.
- Para produção, use **Firebase Authentication** (ou outro Auth) e regras no backend que impeçam sobrescrita indevida e race conditions.

## Suporte / personalizações
- Quer que eu:
  - adicione autenticação com Google (Firebase Auth),
  - implemente Firestore e listeners em tempo real,
  - ou gere o repositório e `README` pronto com GitHub Actions?
  
Basta pedir e eu preparo.

