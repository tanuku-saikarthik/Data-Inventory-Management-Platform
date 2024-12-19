    import mongoose from 'mongoose';

    const customerSchema = new mongoose.Schema({
    cust_id: {
        type: String,
        sparse: false,
        unique:false
    },
    cust_name: {
        type: String,
    },
    cust_add1: {
        type: String,
        
    },
    cust_add2: {
        type: String,
        
    },
    cust_city: {
        type: String,
        
    },
    cust_pincode: {
        type: String,
        
    },
    cust_mob: {
        type: String,
        
    },
    cust_mail: {
        type: String,
        
    },
    cust_bank: {
        type: String,
        
    },
    cust_bk_act: {
        type: String,
        
    },
    cust_ifsc: {
        type: String,
        
    },
    gst_no: {
        type: String,
        
    }
    });

    export default mongoose.model('Customer', customerSchema);