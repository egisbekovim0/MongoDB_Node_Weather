import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const EditionSchema = new Schema({
    key: {
        type: String,
        default: 'Unknown',
    },
    title: {
        type: String,
        default: 'Unknown',
    },
    ebook_access: {
        type: String,
        default: 'Unknown',
    },
}, { _id: false });

const BookDataSchema = new Schema({
    numFound: {
        type: String,
        required: true,
    },
    docs: {
        type: [{
            author_name: {
                type: [String],
                default: ['Unknown'],
            },
            key: {
                type: String,
                default: 'Unknown',
            },
            title: {
                type: String,
                default: 'Unknown',
            },
            edition: {
                type: EditionSchema,
                default: {},
            },
        }],
        default: [],
    },
}, { timestamps: true });

const BookData = mongoose.model('BookData', BookDataSchema);

export default BookData;