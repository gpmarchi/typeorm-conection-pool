import { celebrate, Joi, Segments } from 'celebrate';

export default celebrate({
  [Segments.BODY]: Joi.object().keys({
    password: Joi.string().required(),
    password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    token: Joi.string().required(),
  }),
});
