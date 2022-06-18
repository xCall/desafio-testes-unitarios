import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { OperationType } from '../../entities/Statement';
import { CreateStatementError } from "./CreateStatementError";
import { AppError } from "../../../../shared/errors/AppError";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let userLogin: any;

describe("Create Operation", () => {
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
    await createUserUseCase.execute(user);
    userLogin = await authenticateUserUseCase.execute({
      email: user.email, password: user.password
    });

  });

  it("should be able a create new deposit a existing user", async () => {
    const user_id = userLogin.user.id;

    const deposit = await createStatementUseCase.execute({
      user_id: user_id,
      amount: 150.55,
      description: "deposit",
      type: "deposit" as OperationType
    });

    expect(deposit).toEqual(
      expect.objectContaining({
        user_id: deposit.user_id,
        amount: deposit.amount,
        description: deposit.description,
        type: deposit.type
      })
    );
  });

  it("should be able a create new withdraw a existing user", async () => {
    // await createUserUseCase.execute(user);
    // const userLogin = await authenticateUserUseCase.execute({
    //   email: user.email, password: user.password
    // });

    const user_id = userLogin.user.id;

    await createStatementUseCase.execute({
      user_id: user_id,
      amount: 150.55,
      description: "deposit",
      type: "deposit" as OperationType
    });

    const withdraw = await createStatementUseCase.execute({
      user_id: user_id,
      amount: 150.55,
      description: "withdraw",
      type: "withdraw" as OperationType
    });

    expect(withdraw).toEqual(
      expect.objectContaining({
        user_id: withdraw.user_id,
        amount: withdraw.amount,
        description: withdraw.description,
        type: withdraw.type
      })
    );
  });

  it("should not be able to do a withdraw with insufficient amount", async () => {
    const user_id = userLogin.user.id;

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user_id,
        amount: 151.55,
        description: "withdraw",
        type: "withdraw" as OperationType
      })
    }).rejects.toEqual(new AppError("Insufficient funds", 400));
  });
});
