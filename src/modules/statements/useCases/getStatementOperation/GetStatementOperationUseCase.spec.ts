import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

let userLogin: any;

describe("Get Operation", () => {
  const user = {
    name: 'teste',
    email: 'teste@example.com',
    password: '123456'
  }

  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);

    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);

    await createUserUseCase.execute(user);
    userLogin = await authenticateUserUseCase.execute({
      email: user.email, password: user.password
    });
  });

  it("should be able to record a withdrawal or deposit for registered user", async () => {
    const user_id = userLogin.user.id;
    const deposit = await createStatementUseCase.execute({
      user_id: user_id,
      amount: 150.55,
      description: "deposit",
      type: "deposit" as OperationType
    });

    const withdraw = await createStatementUseCase.execute({
      user_id: user_id,
      amount: 50.53,
      description: "withdraw",
      type: "deposit" as OperationType
    });
    const statement_withdraw = await getStatementOperationUseCase.execute({
      user_id,
      statement_id: withdraw.id
    });

    const statement_deposit = await getStatementOperationUseCase.execute({
      user_id,
      statement_id: deposit.id
    });
    expect(statement_deposit).toHaveProperty("type");
    expect(statement_withdraw).toHaveProperty("type");
  });

});
