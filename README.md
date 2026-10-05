# CP5 Mobile — Minhas Tarefas

Evolução do aplicativo do CP4 para uma **lista de tarefas com autenticação e CRUD no Cloud Firestore**, desenvolvido para Mobile Application Development. A autenticação e a configuração Firebase do CP4 foram reaproveitadas.

## Integrantes

- Giovanna Bardella Gomes — RM 561439
- Erick Takeshi Andrade Nakajune — RM 566059

## Vídeo de Apresentação

https://youtube.com/shorts/Cu2WKLBjkfQ?is=oiJmWuGc4cIlWxcj

## Funcionalidades

- Cadastro com nome, e-mail, senha e confirmação; login; recuperação de senha.
- Sessão persistente usando Firebase Authentication com AsyncStorage.
- Cadastro de tarefas com **quatro inputs**: título, descrição, data e status.
- Validação de campos vazios, limites de tamanho, data real no formato DD/MM/AAAA e status permitido.
- Listagem diretamente do Firestore, atualizada pelo `onSnapshot`.
- Edição e exclusão de tarefas, confirmação antes de excluir e feedback das operações.
- Mensagem para lista vazia, indicadores de carregamento e tratamento de erros.
- Perfil com nome e e-mail obtidos do Firebase Authentication, logout e exclusão de conta.
- Reautenticação com a senha atual antes de limpar as tarefas e excluir a conta.
- Registros separados por UID e regras que impedem o acesso aos dados de outros usuários.

## Tecnologias

React Native 0.86, React 19.2, Expo SDK 57, React Navigation 7, Firebase Authentication, Cloud Firestore e AsyncStorage. A estrutura e a autenticação do CP4 foram mantidas; as dependências foram atualizadas para o Expo Go disponível no iPhone.

## Configuração do Firebase e Firestore — etapa obrigatória

O arquivo `src/services/firebaseConfig.js` mantém a configuração Web do projeto **cp4mobile-a5bca**, usado no CP4. Ele não contém credenciais administrativas. Para usar outro projeto, substitua o objeto `firebaseConfig` e o projeto em `.firebaserc`.

1. Acesse o [Firebase Console](https://console.firebase.google.com/) com a conta responsável pelo projeto `cp4mobile-a5bca`.
2. Em **Authentication → Sign-in method**, confirme que **E-mail/senha** está habilitado.
3. Em **Firestore Database**, clique em **Criar banco de dados** (caso ainda não exista), escolha o banco padrão `(default)` e selecione uma região. Use o modo de produção.
4. Abra a aba **Regras**, substitua o conteúdo pelo arquivo [`firestore.rules`](./firestore.rules) deste projeto e clique em **Publicar**.
5. Aguarde a propagação das regras e execute o aplicativo.

Não é necessário criar coleções manualmente. O primeiro cadastro de tarefa cria o documento do usuário e seu registro, em um lote de escrita.

Como alternativa à publicação das regras pelo console, com Firebase CLI instalado e login realizado:

```bash
firebase deploy --only firestore:rules --project cp4mobile-a5bca
```

As regras permitem leitura e escrita apenas quando `request.auth.uid` corresponde ao UID do caminho. Também validam o formato dos documentos e preservam a data de criação nas atualizações. Referências: [regras por usuário](https://firebase.google.com/docs/rules/basics) e [atualizações em tempo real](https://firebase.google.com/docs/firestore/query-data/listen).

## Estrutura do banco

```text
usuarios/
  uid_do_usuario/               documento: name, email
    registros/
      id_gerado_pelo_firestore/ documento da tarefa
```

Exemplo de campos da tarefa:

```text
title: "Finalizar CP5"
description: "Testar o CRUD e gravar o vídeo"
date: "20/10/2026"
status: "Pendente"
createdAt: Timestamp do servidor
updatedAt: Timestamp do servidor
```

Status aceitos: **Pendente**, **Em andamento** e **Concluída**. O UID é identificado pelo caminho da subcoleção. Nenhuma senha é gravada no Firestore ou manualmente no AsyncStorage.

## Instalação e execução

Instale Node.js 22.22 ou superior e use um dispositivo ou emulador compatível com **Expo SDK 57**. Na pasta que contém `package.json`:

```bash
npm ci
npx expo start
```

No iPhone, instale ou atualize o [Expo Go pela App Store](https://apps.apple.com/us/app/expo-go/id982107779), conecte o iPhone e o computador ao mesmo Wi-Fi e leia o QR code do terminal com a câmera. Permita o acesso à rede local quando solicitado. O projeto utiliza SDK 57, alinhado à versão 57 do Expo Go verificada em 05/10/2026. Em Android, use um Expo Go compatível com SDK 57 ou pressione `a` para um emulador iniciado. Para instalar a versão adequada no Android, consulte [expo.dev/go](https://expo.dev/go).

No Windows, também é possível dar dois cliques em `iniciar.cmd`. Ele usa o Node portátil deste computador quando disponível; em outro computador, é necessário instalar o Node. O arquivo instala as dependências caso estejam ausentes e inicia o Expo.

Para verificar a geração dos bundles JavaScript iOS e Android sem um emulador:

```bash
npx expo export --platform ios --platform android --no-bytecode
```

## Organização

```text
App.js
src/
  components/UI.js
  context/AuthContext.js
  navigation/AppNavigator.js
  screens/
    LoginScreen.js
    RegisterScreen.js
    ForgotPasswordScreen.js
    TasksScreen.js
    TaskFormScreen.js
    ProfileScreen.js
  utils/taskValidation.js
  services/
    firebaseConfig.js
    taskService.js
firestore.rules
firebase.json
```

## Roteiro do vídeo e verificação manual

1. Crie uma conta com nome, e-mail, senha e confirmação. Confira os dados no perfil.
2. Saia e entre novamente com a conta criada.
3. Cadastre **duas tarefas** preenchendo os quatro campos. Confira `usuarios/UID/registros` no Firebase Console.
4. Feche e abra novamente o aplicativo. Mostre a sessão mantida e a listagem carregada do Firestore.
5. Edite uma tarefa, alterando título, data ou status. Confira a lista e o documento no console.
6. Tente salvar um formulário vazio e uma data inexistente, como 31/02/2026. Mostre as validações.
7. Toque em Excluir e cancele. Depois confirme a exclusão. Mostre o feedback, a lista e o console atualizados.
8. Saia e entre com uma **segunda conta**. Mostre que os registros da primeira não aparecem. Crie uma tarefa na segunda conta.
9. Volte à primeira conta e confira que seus registros continuam disponíveis.
10. Demonstre a recuperação de senha por e-mail.
11. Use uma conta de teste para demonstrar a exclusão da conta: informe a senha atual e confirme. Confira a remoção em Authentication e a limpeza das tarefas no Firestore.

Teste também as regras pelo simulador do console: um usuário autenticado deve poder acessar o próprio caminho; um UID diferente e uma requisição sem autenticação devem receber acesso negado.

## Entrega

O enunciado exige **repositório público no GitHub**, README com nomes e RMs e **vídeo demonstrando os fluxos**. Envie o link do repositório na tarefa e o vídeo conforme orientação do professor. Respeite o prazo: commits posteriores ao prazo não são aceitos. O prazo não consta no PDF fornecido.

## Limitações de operação

A configuração do banco e a publicação das regras precisam ser realizadas pela conta responsável pelo Firebase. O teste completo requer internet, banco habilitado e dispositivo/emulador. A exclusão de conta limpa o Firestore antes de remover o usuário no Authentication; são serviços distintos, então uma falha pode deixar uma limpeza parcial. A tela orienta a tentar novamente.

## Verificação automatizada

Execute `npm test` para verificar os campos obrigatórios, status, limites de texto e datas, incluindo anos bissextos. Os quatro testes passaram, as dependências foram validadas pelo Expo e os bundles JavaScript de iOS e Android foram gerados com sucesso. A exportação com bytecode Hermes foi bloqueada pela política de Controle de Aplicativo deste Windows; use --no-bytecode para verificar os bundles JavaScript. Os fluxos com Firebase e dispositivo ainda precisam ser verificados após configurar o banco.
