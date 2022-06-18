import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUserUseCase: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show Profile", () => {
  beforeAll(() => {
    inMemoryUserUseCase = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserUseCase);
    createUserUseCase = new CreateUserUseCase(inMemoryUserUseCase);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUserUseCase);
  });

  const users = {
    name: "teste",
    email: "test@example.com",
    password: "123456"
  }

  it("should be able to list a user", async () => {
    await createUserUseCase.execute(users);
    const user = await authenticateUserUseCase.execute({
      email: users.email,
      password: users.password
    });
    const user_id = user.user.id;

    const showUser = await showUserProfileUseCase.execute(user_id);

    expect(showUser).toEqual(
      expect.objectContaining({
        id: showUser.id,
        name: showUser.name,
        email: showUser.email,
        password: showUser.password,
      })
    );
  });
});
