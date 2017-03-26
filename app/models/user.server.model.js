var mongoose = require('mongoose'),
	crypto = require('crypto'),
    Schema = mongoose.Schema;


//Schema for a User document
var UserSchema = new Schema({
    name: String,

    //indexing the email, to speed up queries
    email: {
	    type: String,
	    index: true
	  },

	//marking username field as unique (so no duplicates are created in the db)
    username:  {
	    type: String,
	    unique: true
	  },
	  
    password: String,
    provider: String,	//strategy used to authenticate user (Local or 3rd party- Fb, Twitter, Gmail)
    providerId: String,	//name of 3rd party authentication provider
    providerData: {},	//storage for 3rd part authentication object
    events: {}	//stores user's TODO items
});

//Hashes the User's password before saving it to Db
UserSchema.pre('save',
    function(next) {
        if (this.password) {
            var md5 = crypto.createHash('md5');
            this.password = md5.update(this.password).digest('hex');
        }

        next();
    }
);

//hash the String password and then check if it's correct
UserSchema.methods.authenticate = function(password) {
    var md5 = crypto.createHash('md5');
    md5 = md5.update(password).digest('hex');

    return this.password === md5;
};


UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne(
        {username: possibleUsername},
        function(err, user) {
            if (!err) {
                if (!user) {
                    callback(possibleUsername);
                }
                else {
                    return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
                }
            }
            else {
                callback(null);
            }
        }
    );
};

mongoose.model('User', UserSchema);