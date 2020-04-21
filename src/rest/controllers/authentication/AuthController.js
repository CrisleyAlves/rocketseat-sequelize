const { validationResult } = require('express-validator/');

const AuthRepository = require("@repositories/AuthRepository");
const { serverError, invalidCredentials } = require("@utils/messages");

const { validations } = require('./AuthControllerValidation');

const auth = {
  validations: validations.authenticate,
  handler: {
    authenticate: async (req, res) => {
      const { password, email } = req.body;

      const schemaErrors = validationResult(req);
      if (!schemaErrors.isEmpty()) {
        return res.status(403).send(schemaErrors.array());
      }

      try {
        const token = await AuthRepository.authenticate(email, password);
        if (!token) return res.status(401).json({ data: { message: invalidCredentials } });

        return res.status(200).json({ data: { token } });
      } catch (error) {
        res.status(500).json({ message: serverError, error });
      }
    }
  },
}

module.exports = {
  auth,
};