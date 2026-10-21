# Gaveta

<img src="assets/logo-concept.svg" alt="Ícone da Gaveta" width="72">

**Guarde vídeos para depois. Feche as abas.**

Uma fila dentro do YouTube para quem abria vídeos em novas abas só para lembrar de assistir mais tarde. Grátis, local e feita por [Evakdo](https://evakdo.com/).

**Português** · [English](README.en.md) · [Ver demo ilustrada (15 s)](assets/gaveta-demo.mp4)

![Prévia da Gaveta em modo claro, com três vídeos de exemplo](assets/preview-light.png)

*Prévia da interface em uma página de teste, com vídeos fictícios. [Ver modo escuro](assets/preview-dark.png) · [Ver gaveta vazia e atalho](assets/preview-empty.png).*

## Como funciona

1. Na home ou nas buscas do YouTube, passe o mouse sobre uma miniatura e clique em **+**. Também dá para usar **Option + clique** no Mac ou **Alt + clique** em outros sistemas.
2. Clique em **Gaveta** no topo do YouTube para abrir a fila. Arraste pela alça para ordenar, baixe a lista em CSV ou remova um item com a lixeira.
3. Clique em um vídeo da fila para assisti-lo. Ele sai da gaveta quando você o abre, inclusive com **Command/Ctrl + clique** ou clique do meio.

Na página de um vídeo, a gaveta mostra **“Já está na Gaveta”** se o link foi salvo antes. Quando a lista está vazia, ela mostra o atalho. O tema claro ou escuro acompanha a preferência do sistema automaticamente.

## Instalar no Chrome

A Gaveta está em **beta (v0.6.0)** e ainda não está na Chrome Web Store:

1. [Baixe o repositório como ZIP](https://github.com/evaldopedrosa/gaveta/archive/refs/heads/main.zip) e descompacte, ou clone o repositório.
2. Abra `chrome://extensions` e ative **Modo do desenvolvedor**.
3. Clique em **Carregar sem compactação** e selecione a pasta descompactada que contém `manifest.json`.
4. Recarregue as abas do YouTube que já estavam abertas.

Ao atualizar os arquivos, clique em **Recarregar** no cartão da extensão em `chrome://extensions` e recarregue as abas do YouTube. Seus links salvos permanecem no armazenamento local do mesmo perfil do Chrome.

## Dados e privacidade

A Gaveta salva **links, títulos e datas**, não baixa os vídeos. A lista fica em `chrome.storage.local` neste perfil do Chrome, sem conta, servidor próprio ou análise de uso. As miniaturas da fila são carregadas do YouTube quando a gaveta está aberta. O limite é de 300 vídeos.

Use **Baixar lista** para guardar uma cópia em CSV. A lista é removida se você desinstalar a extensão; o CSV pode ser guardado separadamente. Veja a [política de privacidade](PRIVACIDADE.md).

## Código e limitações

O código da extensão está nesta pasta: `content.js` desenha a interface e `background.js` administra a fila. Com Node.js instalado, `node tests/background.cjs` verifica a lógica de armazenamento; Node.js não é necessário para usar a extensão.

A interface está em português. Mudanças no layout do YouTube podem exigir ajustes no botão **+**. A demo acima é uma animação ilustrativa; as capturas mostram a interface real da extensão sobre uma página de teste.

Gaveta é um projeto independente, sem afiliação ao YouTube ou ao Google. YouTube é marca do Google LLC.
