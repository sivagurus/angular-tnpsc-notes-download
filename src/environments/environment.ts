export const environment = {
  production: false,
  storeQuery: `query ($token: String!) {
  title: constant(value: "")
  withAuth(token: $token) {
    config{
      s3EndPoint
    }
    user{
      student{
        myCourses(tabCategoryId: 2,limit:8){
                   id
            name
						label{
              text
              value
              bgColor
              color
             iconUrl
           }
						tag{
              text
              value
              bgColor
              color
              bgTriangleColor              
           }
            description
            price
            minPrice
            priceShare
            discount
            internetHandlingCharges
            isLifetime
            expiryDateType
            expiryDateValue
            isActive
            imageUrl
            createdBy{
              name
            }
            createdByName
            isPublished
            isShareable
            isRevoked
            expiresAt
            createdAt
            isDeletable
            isReselling
            isPurchased
            isOwn
            isGlobal
            taxType
            isWebVideoAllowed
            isExpiryFixed
            fixedExpiryDate
            categories
            freeResources
            isFeatured
          likes
          faded
          }
      }
    }
  }
}

mapper<safejs-
if(!data || !data.withAuth || !data.withAuth.user || !data.withAuth.user.student || !data.withAuth.user.student.myCourses || !data.withAuth.user.student.myCourses.length){
  return {data:null, parent};
} 
let s3BaseUrl = data.withAuth.config.s3EndPoint;
data.isCarousel = data.isCarousel == 'true'
data.count = data.totalCount || 0;
data.title = "COURSES (" + data.count +")";
data.starUrl =  "";
data.viewAll= {
text: "View All",
deeplink: {
        screen: "SCREEN_STORE_LISTING",
        paramOne: "tabCategoryId=2",
        paramTwo: "",
        paramThree: ""
      },
},
data.viewAll = data.count>0?data.viewAll:null
data.items = data.withAuth.user.student.myCourses.map(course => ({
    tag: {
        text: course.tag ? course.tag.text : null,
        bgColor: course.tag ? course.tag.bgColor : null,
        color: course.tag ? course.tag.color : null,
        bgTriangleColor: course.tag ? course.tag.bgTriangleColor : "#B30000"
      },
      imageUrl:course.imageUrl,
      heading: course.name,
      subHeading: course.description,
      subHeadingIcon: '',
      emblem: {
        text: course.label ? course.label.text : null,
        bgColor: course.label ? course.label.bgColor : null,
        color: course.label ? course.label.color : null,
        icon: course.label ? course.label.iconUrl : null
      },
       priceText: @guruprice,
        strikeThroughPriceText: course.discount ? "₹" + course.price + "/-" : "",
percentageText: course.discount ? !Number.isInteger((course.discount/course.price)*100) ? Number((course.discount/course.price)*100).toFixed(2) + "% OFF"  : (course.discount/course.price)*100 + "% OFF" : "",
      faded: course.faded ? course.faded :0,
      likeEmblem: {
        color: "#000000",
        text: course.likes == '0' || course.likes == '' ? '' : course.likes,
        bgColor: '',
        icon: course.likes == '0' || course.likes == '' ? '' : s3BaseUrl + 'red_icon_3x.png',
      },
            deeplink: {
        screen: "COURSE_DETAILS",
        paramOne: @guruid,
        paramTwo: course.name,
        paramThree: ""
            },
      }));
delete data.withAuth;
delete data.totalCount;
-js>`
};