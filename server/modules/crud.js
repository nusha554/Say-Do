const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const CrudSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please enter a name'],
        trim: true,
        maxlength: [50, 'Name must be less than 50 characters']
    },
    comment: {
        type: String,
        default: false 
    },
    isComplete: {
        type: Boolean,
        default: false
    },
    color: {
        type: String,
        default: false 
    }, 
    highPriority: {
        type: Boolean,
        default: false
    }
}, )

// CrudSchema.plugin(AutoIncrement, {id:'order_seq',inc_field: 'orderNumber'});
// var ItemModel = mongoose.model('Item', CrudSchema);

module.exports = mongoose.model('crud', CrudSchema)