var mongoose  =  require( 'mongoose' );
var Schema    =  mongoose.Schema;

var reviews  =  new Schema({
		reviewerName       :	{ 
							type     : String, 
							required : true 
						},
		movieTitle   :	{
							type     : String,
							required : true
						},
		rating   :	{
							type     : Number,
							required : true
						},
		reviewString   :	{
							type     : String,
							required : true
						}
	});
	
var Reviewer  =  mongoose.model( 'Reviewer' , reviews );

module.exports  =  Reviewer;