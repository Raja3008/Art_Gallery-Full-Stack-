import express from "express"
import dotenv from "dotenv"
import stripe from "stripe"

dotenv.config();

const app=express();

app.use(express.static("public"));
app.use(express.json());

app.get("/",(req,res)=>{
    res.sendFile("fs.html",{root:"public"});
})
app.get("/cart.html",(req,res)=>{
    res.sendFile("cart.html",{root:"public"});
})
app.get("/success.html",(req,res)=>{
    res.sendFile("success.html",{root:"public"});
})
app.get("/cancel.html",(req,res)=>{
    res.sendFile("cancel.html",{root:"public"});
})

let StripeGateway=stripe(process.env.stripe_key);
app.post("/stripe-checkout",async(req,res)=>{
    const lineItems=req.body.items.map((item)=>{
        const unitAmount=parseInt(parseFloat(item.price)*100)
        console.log("item-price:",item.price)
        console.log("unitAmount:",unitAmount)
        return{
            price_data:{
                currency:"inr",
                product_data:{
                    name:item.name,
                    images:[item.image],
                },
                unit_amount:unitAmount
            },
            quantity:1,
        }
    })
    const session=await StripeGateway.checkout.sessions.create({
        payment_method_types:["card"],
        mode:"payment",
        success_url:`http://localhost:3011/success.html`,
        cancel_url:`http://localhost:3011/cancel.html`,
        billing_address_collection:"required",
        line_items:lineItems,
    });
    res.json({url:session.url});
})

app.listen(3011,()=>{
    console.log("listening on port 3011");
});