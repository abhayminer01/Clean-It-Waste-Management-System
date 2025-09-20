const registerUser = async (req, res) => {

}

const checkAuth = async (req, res) => {
    try {
        res.status(200).json({ success : true });
    } catch (error) {
        res.status(500).json({ success : false, message : 'Error Occured', err : error });
        console.log(error);
    }
}

module.exports = {
    registerUser,
    checkAuth
}