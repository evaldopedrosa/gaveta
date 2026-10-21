# Gaveta

[English guide](README.en.md) · **Guia em português**

Uma fila simples para guardar vídeos sem abrir várias abas. A extensão funciona nas páginas de `www.youtube.com` e guarda os links **somente neste Chrome**.

## Instalar

1. Abra `chrome://extensions` no Chrome.
2. Ative **Modo do desenvolvedor**.
3. Clique em **Carregar sem compactação** e escolha esta pasta, que contém `manifest.json`.
4. Recarregue as páginas do YouTube que já estavam abertas.

## Usar

- Passe o mouse sobre uma thumbnail e clique no ícone **+** no canto superior esquerdo.
- Ou use **Option + clique** em qualquer link de vídeo do YouTube. O vídeo vai para a gaveta sem abrir outra aba.
- Clique em **Gaveta** no cabeçalho do YouTube para abrir o painel. Clique novamente ou no **×** para recolher.
- Com a lista vazia, a gaveta mostra o atalho **Option (Alt) + clique** para guardar um vídeo.
- Arraste um vídeo pela alça de seis pontos para mudar a ordem. Com a alça selecionada pelo teclado, use as setas ↑ e ↓.
- Clique no ícone de lixeira para remover um vídeo.
- Clique em **Baixar lista** no rodapé da gaveta para salvar um CSV com títulos, links e datas. O arquivo pode ser aberto em um editor de texto ou planilha.
- No rodapé, **Evakdo** abre `https://evakdo.com/` em outra aba quando você clica.
- Em uma página de vídeo, use **Guardar este vídeo** dentro da gaveta. Se ele já estiver salvo, o botão mostra **Já está na Gaveta**.
- **Command + clique** continua abrindo uma nova aba normalmente.

Abrir um item da gaveta usa a aba atual e o remove da lista. **Command/Ctrl + clique** ou clique do meio abre em outra aba e também remove o item. O tema claro ou escuro acompanha a preferência do sistema.

## Privacidade e limites

A extensão só pede acesso ao YouTube e ao armazenamento local do Chrome. Ela não usa conta, servidor, análise de uso ou reprodução de vídeo em segundo plano. As imagens pequenas das thumbnails vêm do YouTube quando a gaveta é exibida. O limite é de 300 vídeos, e a lista é removida se a extensão for desinstalada. A lista baixada é um arquivo no computador; guarde-o em lugar privado se os vídeos revelarem interesses pessoais. Mudanças na interface do YouTube podem exigir ajustes no botão sobre as thumbnails; o Option + clique depende apenas dos links dos vídeos.

Com a gaveta fechada, cada aba mantém só a contagem de itens. A lista e as thumbnails são carregadas ao abrir o painel. A extensão não abre ou reproduz vídeos em segundo plano.
