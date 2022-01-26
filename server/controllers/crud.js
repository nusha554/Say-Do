const CrudScheme = require('../modules/crud')


const getAllData = async (req, res) => {
    try {
        const crud = await CrudScheme.find({})
        res.status(200).json({crud})
    } catch (error) {
        res.status(500).json({message: error})
    }
}

const createData = async (req, res) => {
    try {
        const crud = await CrudScheme.create(req.body)
        res.status(201).json({crud})
    } catch (error) {
        res.status(500).json({message: error})
    }
}

const getOneItem = async (req, res) => {
    try {
        const {itemID:crudID} = req.params;
        const crud = await CrudScheme.findOne({_itemID:crudID})
    
        if (!crud) {
            return res.status(404).json({message: 'The note does not exsist'})
        }
        res.status(200).json({crud})
    } catch (error) {
        res.status(500).json({message: error})
    }
}


const updateData = async (req, res) => {
    try {
        const {itemID:crudID} = req.params;
        const crud = await CrudScheme.findByIdAndUpdate({_id: crudID}, req.body, {
            new: true,
            runValidators: true
        })
    
        if (!crud) {
            return res.status(404).json({message: 'The note does not exsist'})
        }
        res.status(200).json({crud})
    } catch (error) {
         res.status(500).json({message: error})
    }
}


const deleteData = async (req, res) => {
    try {
        const {itemID:crudID} = req.params;
        const crud = await CrudScheme.findByIdAndDelete({_id: crudID})
        if (!crud) {
            return res.status(404).json({message: 'The note does not exsist'})
        }
        res.status(200).json({crud})
    } catch (error) {
         res.status(500).json({message: error})
    }
}

module.exports = {
    getAllData, createData, getOneItem, updateData, deleteData
}