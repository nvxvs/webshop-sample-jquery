var RESPONSE_ = {
    currency: "€",
    products: [
        {
            id: "product-1",
            name: "Billed Murray",
            rating: "4",
            listPrice: "200",
            discount: "15",
            image: "http://www.fillmurray.com/g/500/200"
        },

        {
            id: "product-2",
            name: "Bill's hovercraft is full of eels",
            rating: "1",
            listPrice: "250",
            discount: "10",
            image: "http://www.fillmurray.com/g/300/250"
        },
        {
            id: "product-3",
            name: "Bill fills everything",
            rating: "5",
            listPrice: "2500",
            image: "http://www.fillmurray.com/g/300/400"
        },
        {
            id: "product-4",
            name: "Bill needs you to buy this product so much",
            rating: "5",
            listPrice: "3580",
            discount: "20",
            image: "http://www.fillmurray.com/g/300/300"
        },
        {
            id: "product-5",
            name: "Bill no more",
            rating: "4",
            listPrice: "2324",
            discount: "11",
            image: "http://www.fillmurray.com/g/350/500"
        },
        {
            id: "product-6",
            name: "Bill no more",
            rating: "2",
            listPrice: "5432",
            image: "http://www.fillmurray.com/g/350/200"
        }
    ]
};

$( document ).ready(function() {
    const main = $('.product-container').processData({}) //no options but i left here
    const $dd_sort = $('#sortBy')
    $dd_sort.on('change', (ev)=>{
        main.sort(ev.target.value)
    })
    main.load(RESPONSE) // initial loading of data
    
    
    $('#loadproducts').on('click', ()=>{
        main.load(RESPONSE)
    })
});
