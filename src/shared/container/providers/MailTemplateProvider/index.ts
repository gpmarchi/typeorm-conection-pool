import { container } from 'tsyringe';

import { HandlebarsMailTemplateProvider } from './implementations/HandlebarsMailTemplateProvider';
import { IMailTemplateProvider } from './interfaces/IMailTemplateProvider';

const providers = {
  handlebars: HandlebarsMailTemplateProvider,
};

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  providers.handlebars,
);
