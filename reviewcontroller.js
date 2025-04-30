const Movie          =  require( "./movie" );
const Review        =  require( "./review" );
var   jwt            =  require( 'jsonwebtoken' );

exports.postReview = 
	async function( req , res )
	{
		// === Extract the Token from Request Header === //
		// since jwt auth is required, its safe to assume it's there and in the form we sent it 
		// "JWT " + token
		token = req.headers.authorization.substr(4);
		decoded = jwt.verify(token, process.env.SECRET_KEY);
		
		// === Validate that Review has Associated Movie === //
		if ( !req.body.movieTitle )
		{
			res.status( 500 ).send( { msg : 'movieTitle validation failed' } );
		}
		// === Validate ReviewerName Field === //
		else if ( !req.body.reviewerName || req.body.reviewerName != decoded.username )
		{
			res.status( 500 ).send( { msg : 'ReviewerName validation failed' } );
		}
		// === Validate reviewString Field === //
		else if ( !req.body.reviewString || req.body.reviewString == '' )
		{
			res.status( 500 ).send( { msg : 'reviewString validation failed' } );
		}
		// === Validate Rating Field === //
		else if ( !req.body.rating || isNaN(req.body.rating) || ( req.body.rating < 0 || req.body.rating > 5 ) )
		{
			res.status( 500 ).send( { msg : 'Rating validation failed' } );
		}
		// === All Validation Successful === //
		else
		{
			// === Validate that Reviewed Movie Exists === //
			movie = await Movie.findOne( { title : req.body.movieTitle } );
			
			// ===  No Associated Movie Found === //
			if ( !movie )
			{
				res.status( 500 ).send( { msg : 'That Movie Does Not Exist' } );
			}
			// === Save Review === //
			else
			{
				// === Prepare Review Model for Saving === //
				let review  =  new Review({
											reviewerName   :  req.body.reviewerName,
											movieTitle :  req.body.movieTitle,
											rating     :  req.body.rating,
											reviewString      :  req.body.reviewString
										});
										
				// === Save the Review Object === //
				review.save(
						( err , review ) =>	
						{
							if( err )
							{
								res.status( 500 ).send( err );
							}
							res.status( 200 ).send({
													success : true,
													msg     : "Review Successfully Posted"
												});
						});
			}
		}
	};

exports.getReview =
	( req , res ) =>
	{
		// === Query Database === //
		Review.find(
			req.query,
			( err , review ) =>
			{
				if ( err )
				{
					res.status( 500 ).send( err );
				}
				res.status(200).send( review );
			});
	};
	
