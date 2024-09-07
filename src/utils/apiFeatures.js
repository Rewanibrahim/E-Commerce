


export class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    pagination() {
        let page = this.queryString.page * 1 || 1;
        let limit = 2;
        let skip = (page - 1) * limit;
        this.mongooseQuery.find().skip(skip).limit(limit);
        return this;
    }

    filter() {
        const excludeQuery = ["page", "search", "sort", "select"];
        let filterQuery = { ...this.queryString }; // deep copy
        excludeQuery.forEach(e => delete filterQuery[e]);
        filterQuery = JSON.parse(JSON.stringify(filterQuery).replace(/\b(gt|lt|gte|lte|eq)\b/g, (match) => `$${match}`));
        this.mongooseQuery.find(filterQuery);
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            this.mongooseQuery.sort(this.queryString.sort.replaceAll(",", " "));
        }
        return this
    }

    select(){
        if (this.queryString.fields) {
            this.mongooseQuery.sort(this.queryString.fields.replaceAll(",", " "));
        }
        return this
    }

    search(){
        if (this.queryString.search){
            mongooseQuery.find({
              $or: [
                {title: {$regex: req.query.search, $options: "i"}},
                {description: {$regex: req.query.search, $options:"i"}}
              ]
            })
          }
        return this
    }
}
