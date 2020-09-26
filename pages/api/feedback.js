import nc from 'next-connect';
import { sendSupportEmail } from '../../server/services/support-email-service';

export default nc().post(async function (req, res) {
	res.json(await sendSupportEmail(req.body));
});
