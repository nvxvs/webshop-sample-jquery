/* We are assuming the object from the server is consistent, and pre-checked,
 * all keys have the same type of its value.
*/
(function ( $ ) {
    $.fn.processData = function( options ) {
        let settings = $.extend({
            
        }, options );

        let dataset = []; //list of the products
        let currency = null
        

        function roundPrice(price) {
            // do the math according to price rounding rules
            return Math.round(price)
        }
        function calcSalePrice(listPrice, discount, round = true){
            if(!discount) return listPrice

            const salePrice = listPrice - (discount / 100) * listPrice
            return round ? roundPrice(salePrice) : salePrice 
        }
        function createBadge(discount){
            // percentage symbol added via css pseudo after
            return discount ? 
                `<div class="badge">
                    <div class="badge-text">${discount}</div>
                </div>`
                :
                ''
        }
        function priceWithCurrency(price, appendCurrency = true){
            return appendCurrency ? `${price}${currency}` : price
        }
        function createPrice(listPrice, salePrice){
            let sp = priceWithCurrency(salePrice)
            let lp = priceWithCurrency(listPrice)
            return salePrice ? 
            `<div class="list-price discounted">${sp}</div>
            <div class="discount-price">${lp}</div>`
            :
            `<div class="list-price">${lp}</div>`
        }

        function handleAddToCart(ev){
            /* add your functionality to handle add to cart.
             * Do we need to remove ev listener? In this case we leave it right there, 
             * to enable the customer increase the qty of the product in the cart.
             */
            const productId = $(ev.target).data('product-id')
            alert(`${productId} added to cart`)
        }

        function createStars(rating){
            rating = parseInt(rating) || 0 // make sure its a number
            let stars = '';
            for(var i = 0; i < 5; i++){
                stars += 
                `<svg class="icon ${ i<(rating) ? ` rated` : `` }">
                    <use xlink:href="#stars-full-star">
                </svg>`
            }
            return stars
        }
        function buildCards (product){
            
            const {listPrice, discount, name, id, rating, image} = product // destructuring product object
            const isSale = calcSalePrice(listPrice, discount)
            const salePrice =   isSale < listPrice ? isSale : null // we are using it in sorth method so cannot return null

            /* JQuery is so flexible, so we are not using (append, find, children, etc functions), to
             * increase readability of the template code. This project does not require much functionality.
             * Except the cart button, is listening to a user input.
             * 
            */
            const cardTemplate = 
            `
            <div class="product-card" data-id=${id}>
                ${createBadge(discount)}
                <div class="card-inner-wrapper">
                    <a href="#" title="${name}">
                        <div class="product-image"><img src="${image}" alt="${name}"></div>
                    </a>
                <div class="product-name">
                    <a href="#">
                        <p title="Go to product page">${name}</p>
                    </a>
                </div>
                <div class="card-footer-group">
                    <div class="product-rating" data-rating=${rating} title="Rating ${rating}/5">
                    <div class="rating">
                        ${createStars(rating)}
                    </div>
                    </div>
                    <div class="product-price">
                        ${createPrice(listPrice, salePrice)}
                    </div>
                    <div class="product-action">
                    <button class="btn btn-primary" data-product-id=${id}>Add to cart</button>
                    </div>
                </div>
                </div>
            </div>
            `
            let card = $(cardTemplate)
            card.on('click', ':button', handleAddToCart)
            return card
        }
        
        // use arrow fn to avoid binding
        const render = ()=>{
            sortDistributor(sortValue)
            this.append(make(dataset))
        }

        function make(products){
            return products.map( product=> buildCards(product))
        }

        /* we are sorting the array and rendering its content 
         * rather then selecting the DOM elements and re-read its values
         * and then ordering them.
        */
        var sort = (fn)=>{
            dataset.sort(fn)
            reRender()
        }

        function sortByPrice(productA, productB){
            return calcSalePrice(productA.listPrice, productA.discount) > calcSalePrice(productB.listPrice, productB.discount) 
        }
        function sortByDiscountAmount(productA, productB){
            return calcSalePrice(productA.listPrice, productA.discount) - productA.listPrice > calcSalePrice(productB.listPrice, productB.discount)  - productB.listPrice
        }
        function sortByRate(productA, productB){
            return productA.rating < productB.rating
        }
        //cast the number string to a valid number for further use (like:sort)
        function normalizeProductsData(arrOfProducts){
            // because we are using jquery why not to use it's generic iterator
            const normalized = arrOfProducts.map( product =>{
                if(typeof(product) != 'object') return // jsut in case
                const filtered = {}
                $.each(product, function(index, value) {
                    filtered[index] = value == parseInt(value) ? parseInt(value) : value
                });
                return filtered
            })
            return normalized
        }


        var reRender =()=>{
            //console.log('rerendered')
            this.html(
                make(dataset)
            )
        }
        var sortValue = 'price';
        var sortDistributor = (value)=>{
            switch (sortValue) {
                case 'discount':
                    sort(sortByDiscountAmount)
                    break;
                case 'rating':
                    sort(sortByRate)
                    break;
                default:
                    sort(sortByPrice)
                    break;
            }
            
        }
        return {
            render : render(),
            load: (data)=>{
                currency = currency || data.currency
                dataset = [...dataset, ...normalizeProductsData(data.products)]
                sortDistributor(sortValue)
                reRender()
            },
            sort: (value)=> {
                sortValue = value
                sortDistributor(sortValue)
            }
        }
 
    };
 
}( jQuery ));

var RESPONSE = {
    currency: "€",
    products: [
        {
            id: "product-1",
            name: "Billed Murray fsdkfmslfmk slkdf klsmd fksdmf kls wlkfm lkfm skslkfm sklfm skmf welf msklfm sf lwfm sfm lskmf wefmsldfmk slkdfm ,,,,, dfsfsf ,s, s.f s.df, sd,f s.,f..... sdf sdf. ,s.df, ",
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
        },
        {
            id: "product-7",
            name: "Bill no more",
            rating: "0",
            discount: "99",
            listPrice: "9000",
            image: "http://www.fillmurray.com/g/350/200"
        },
        {
            id: "product-8",
            name: "Bill no more price",
            rating: "0",
            discount: "3",
            listPrice: "310",
            image: "http://www.fillmurray.com/g/350/200"
        },
        {
            id: "product-9",
            name: "Bill price",
            rating: "0",
            discount: "3",
            listPrice: "310",
            image: "http://www.fillmurray.com/g/350/200"
        }
    ]
};
var RESPONSE2 = {
    currency: "€",
    products: [
        {
            id: "product-1",
            name: "Plüss Alza földönkívüli II",
            rating: "4",
            listPrice: "200",
            discount: "15",
            image: "https://cdn.alza.hu/ImgW.ashx?fd=f3&cd=MA0100"
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
        },
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


