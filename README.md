# Gaveta

![Conceito de marca da Gaveta](assets/logo-concept.svg)

[English](README.en.md) · **Português**

Uma fila leve para guardar vídeos do YouTube™ sem abrir dezenas de abas. Projeto independente feito por [Evakdo](https://evakdo.com/).

**Estado:** versão beta 0.5.0. A extensão ainda não está publicada na Chrome Web Store.

O ícone acima é um conceito inicial de marca.

## O que faz

- Guarda um vídeo pelo botão **+** na miniatura ou com **Option/Alt + clique** no link.
- Mostra a fila em uma gaveta recolhível na página do YouTube.
- Permite arrastar para ordenar e remover com o ícone de lixeira.
- Baixa a lista em CSV com títulos, links e datas.
- Mantém até 300 vídeos no armazenamento local deste perfil do Chrome.

## Instalação local

1. Baixe o código como ZIP e descompacte, ou clone este repositório.
2. Abra `chrome://extensions` no Chrome e ative **Modo do desenvolvedor**.
3. Clique em **Carregar sem compactação** e escolha esta pasta, que contém `manifest.json`.
4. Recarregue as páginas do YouTube que já estavam abertas.

Veja [LEIA-ME.md](LEIA-ME.md) para os controles e limites.

## Verificação do código

Com Node.js instalado, execute `node tests/background.cjs` para testar a lógica da fila. A extensão em si não precisa de Node.js para funcionar.

## Privacidade

A extensão não tem servidor próprio, conta ou análise de uso. Ela salva somente os vídeos adicionados pelo usuário no `chrome.storage.local`. Ao abrir a gaveta, títulos e links são exibidos na página do YouTube e as miniaturas são carregadas de `i.ytimg.com`. O link do rodapé abre `evakdo.com` somente quando clicado. Leia a [política de privacidade](PRIVACIDADE.md).

## Antes de uma publicação pública

- Concluir a revisão de privacidade da interface exibida no YouTube.
- Criar a importação da lista para migrar dados de instalações locais.
- Aprovar o ícone e preparar imagens e textos da Chrome Web Store.
- Testar em diferentes layouts do YouTube e traduzir a interface para inglês. A interface atual está em português.

Este projeto não é afiliado ao YouTube ou ao Google. YouTube é uma marca do Google LLC.
