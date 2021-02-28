interface NewUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
interface UserData extends NewUserData {
  _id: string;
}

class User {
  static findByEmail(email: string): UserData | null {
    return null;
  }
  static async create(newUserData: NewUserData): Promise<{ _id: string }> {
    return { _id: "mockId" };
  }
}

export default User;
