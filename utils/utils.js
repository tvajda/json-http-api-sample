
function validEmail(email) {
	var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return emailRegex.test(email);
}

exports.validEmail = validEmail;