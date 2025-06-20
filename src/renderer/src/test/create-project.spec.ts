// Arquivo: tests/create-project.spec.ts
import {
  test,
  expect,
  _electron as electron,
  ElectronApplication,
  Page,
} from "@playwright/test";

let electronApp: ElectronApplication;
let window: Page;

// Antes de cada teste, lança a aplicação Electron
test.beforeEach(async () => {
  electronApp = await electron.launch({ args: ["."] });
  window = await electronApp.firstWindow();
  await window.waitForLoadState("domcontentloaded");
});

// Depois de cada teste, fecha a aplicação
test.afterEach(async () => {
  await electronApp.close();
});

test("Fluxo de Criação de Projeto: Deve criar um novo projeto com sucesso", async () => {
  // 1. Navega para a página de criação de projeto
  // (No seu app, o link/botão pode estar no Sidebar ou em outro lugar)
  await window.getByRole("button", { name: "Novo Projeto" }).click();

  // Valida se está na página certa
  await expect(
    window.getByRole("heading", { name: "Novo Projeto" }),
  ).toBeVisible();

  // 2. Preenche o Passo 1: Informações Básicas
  await window.getByLabel("Nome do Projeto").fill("Meu Projeto Automatizado");
  await window.getByLabel("Número do Contrato/Proposta").fill("C-AUTO-2025");
  await window.getByLabel("Cliente").fill("Cliente Teste S.A.");
  await window.getByRole("button", { name: "Avançar" }).click();

  // 3. Preenche o Passo 2: Escopo e Detalhes
  await window
    .getByLabel("Descrição Detalhada do Projeto")
    .fill("Descrição gerada por um teste automatizado.");
  await window.getByLabel("Engenheiro Responsável").fill("Robô de Teste");
  await window.getByRole("button", { name: "Avançar" }).click();

  // 4. Preenche o Passo 3: Prazos e Orçamento
  await window.getByLabel("Data de Início").fill("2025-07-01");
  await window.getByLabel("Data de Término Prevista").fill("2025-12-31");
  await window.getByLabel("Valor do Orçamento (R$)").fill("98765");
  await window.getByRole("button", { name: "Avançar" }).click();

  // (Aqui você adicionaria os passos para Máquinas e Equipe se necessário)
  // ...
  await window.getByRole("button", { name: "Avançar" }).click(); // Pula Máquinas
  await window.getByRole("button", { name: "Avançar" }).click(); // Pula Equipe

  // 5. Verifica o Passo 6: Revisão
  await expect(window.getByText("Meu Projeto Automatizado")).toBeVisible();
  await expect(window.getByText("Cliente Teste S.A.")).toBeVisible();
  await expect(window.getByText("R$ 98765")).toBeVisible();

  // 6. Finaliza a criação
  // Mockamos a API para este teste para não criar lixo no banco de dados real
  await window.evaluate(() => {
    // @ts-ignore
    window.api.createProject = () =>
      Promise.resolve({ id: 999, name: "Meu Projeto Automatizado" });
  });

  await window
    .getByRole("button", { name: "Finalizar e Criar Projeto" })
    .click();

  // 7. Valida o resultado final
  // Neste exemplo, vamos supor que após criar, o app volta para a lista de projetos
  // e exibe o projeto recém-criado.

  // Aguarda o redirecionamento para a página de projetos
  await expect(window.getByRole("heading", { name: "Projetos" })).toBeVisible();
  // Verifica se o card do novo projeto está visível na tela
  await expect(window.getByText("Meu Projeto Automatizado")).toBeVisible();
});
