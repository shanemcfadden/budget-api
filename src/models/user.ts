interface UserData {
  email: string;
  password: string;
  _id: string;
  firstName: string;
  lastName: string;
}
class User {
  static findByEmail(email: string): UserData | null {
    return null;
  }
  static async create(newUserData: UserData): Promise<{ _id: string }> {
    return { _id: newUserData._id };
  }
}

export default User;
