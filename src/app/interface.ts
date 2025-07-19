export interface ClerkType {
    data: {
      id: string;
      first_name: string;
      last_name: string;
      image_url: string;
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
      email_addresses: any[];
    };
    type: "user.created" | "user.updated" | "user.deleted";
  }