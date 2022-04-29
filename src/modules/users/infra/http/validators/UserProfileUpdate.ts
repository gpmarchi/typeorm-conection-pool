import { celebrate, Joi, Segments } from 'celebrate';

export default celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    old_password: Joi.string().when('password', {
      not: undefined,
      then: Joi.string().required(),
    }),
    password: Joi.string(),
    password_confirmation: Joi.string()
      .when('password', {
        not: undefined,
        then: Joi.string().required(),
      })
      .valid(Joi.ref('password')),
  }),
});
