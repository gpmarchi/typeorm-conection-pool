import { IParseMailTemplateDTO } from '../../MailTemplateProvider/dtos/IParseMailTemplateDTO';

interface IMailContact {
  name: string;
  email: string;
}

interface IMailDataDTO {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  template: IParseMailTemplateDTO;
}

export { IMailDataDTO };
