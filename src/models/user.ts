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
}

export default User;
