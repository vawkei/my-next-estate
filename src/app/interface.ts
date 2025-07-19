export interface ClerkType {
    data: {
      id: string;
      first_name: string;
      last_name: string;
      image_url: string;
      email_addresses: any[];
    };
    type: "user.created" | "user.updated" | "user.deleted";
  }