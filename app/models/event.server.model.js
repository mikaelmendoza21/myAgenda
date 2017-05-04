var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EventSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    date:{  //the Date of the event
        type: Date,
        default:Date.now,
        required: "Must specify a Date for the event"
    },
    title: {
        type: String,
        default: '',
        trim: true,
        required: "Title can't be blank"
    },
    completed: {
        type: Boolean,
        default: false
    }
});
mongoose.model('Event', EventSchema);