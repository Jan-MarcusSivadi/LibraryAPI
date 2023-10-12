let data = [
    {id:1,firstname:"Jeff",lastname:"Bezos",email:"jeffbezos@amazon.com",password:"markzuckerbergsux",username:"bigbezos420",phonenr:"+1 11748794"},
    {id:2,firstname:"Mark",lastname:"Zuckerberg",email:"markzuckerberg@facebook.com",password:"jeffbezossux",username:"markzuckofficial",phonenr:"+1 82543794"},
    {id:3,firstname:"Fred",lastname:"Durst",email:"limp@bizkit.com",password:"noookie333",username:"LimpBizkut",phonenr:"+1 56663342"},
    {id:4,firstname:"Sam",lastname:"Hyde",email:"samhyde@gmail.com",password:"idubbzgfishot32",username:"300yearoldvampire",phonenr:"+1 76532356"}
]

exports.getAll = () => {
    return data
}

exports.getById = (id) => {
    return getUser = data.find((user) => user.id == parseInt(id))
}

exports.create = (newUser) => {
    const newId = Math.max(...data.map((i) => i.id)) + 1
    newUser.id = newId
    data.push(newUser)
    return newUser
}

exports.delete = (id) => {
    var toBeDeleted = this.getById(id)
    if(toBeDeleted === undefined) return
    data = data.filter((e) => toBeDeleted.id != e.id)
    return toBeDeleted
}