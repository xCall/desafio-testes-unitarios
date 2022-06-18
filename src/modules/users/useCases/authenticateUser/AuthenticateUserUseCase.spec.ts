import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../useCases/createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  const user = {
    name: "teste",
    email: "test@example.com",
    password: "123456"
  }

  it("should be able to authenticate existing user", async () => {
    await createUserUseCase.execute(user);

    const authentication = await authenticateUserUseCase
      .execute({ email: user.email, password: user.password });

    expect(authentication).toHaveProperty("token");
  });
});
