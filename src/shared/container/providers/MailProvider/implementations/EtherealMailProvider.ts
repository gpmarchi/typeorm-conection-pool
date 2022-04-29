import nodemailer, { Transporter } from 'nodemailer';
import { injectable, inject } from 'tsyringe';

import mailConfig from '@config/mail';

import { IMailTemplateProvider } from '../../MailTemplateProvider/interfaces/IMailTemplateProvider';
import { IMailDataDTO } from '../dto/IMailDataDTO';
import { IMailProvider } from '../interfaces/IMailProvider';

@injectable()
class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  private mailTemplateProvider: IMailTemplateProvider;

  constructor(
    @inject('MailTemplateProvider')
    mailTemplateProvider: IMailTemplateProvider,
  ) {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });

    this.mailTemplateProvider = mailTemplateProvider;
  }

  public async sendMail({
    to,
    from,
    subject,
    template,
  }: IMailDataDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;

    const emailMessage = await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(template),
    });

    console.log('Message sent: %s', emailMessage.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(emailMessage));
  }
}

export { EtherealMailProvider };
