

//const url = "http://localhost:64827";

const url = "";

export const URL = {

    main_URL : url,

    part_url : url+"/api/parts?",
    analog_url : url+"/api/parts?analog=",
    currency_url : url+"/api/parts?rate",
    contact_url: url + "/api/contact",
    shopingCart_url: url + "/api/shoppingcart",
};

export default URL;