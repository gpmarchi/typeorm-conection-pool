interface IMailConfig {
  driver: 'ethereal';

  defaults: {
    from: {
      name: string;
      email: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      name: process.env.DEFAULT_FROM_NAME,
      email: process.env.DEFAULT_FROM_EMAIL,
    },
  },
} as IMailConfig;
