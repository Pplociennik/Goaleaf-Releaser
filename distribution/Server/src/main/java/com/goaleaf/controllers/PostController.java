package com.goaleaf.controllers;


import com.auth0.jwt.exceptions.TokenExpiredException;
import com.goaleaf.entities.DTO.PostReactionsNrDTO;
import com.goaleaf.entities.Post;
import com.goaleaf.entities.PostReaction;
import com.goaleaf.entities.User;
import com.goaleaf.entities.enums.PostTypes;
import com.goaleaf.entities.viewModels.habitsManaging.postsCreating.NewPostViewModel;
import com.goaleaf.entities.viewModels.habitsManaging.postsManaging.AddReactionViewModel;
import com.goaleaf.entities.viewModels.habitsManaging.postsManaging.EditPostViewModel;
import com.goaleaf.entities.viewModels.habitsManaging.postsManaging.RemovePostViewModel;
import com.goaleaf.services.*;
import com.goaleaf.validators.exceptions.accountsAndAuthorization.AccountNotExistsException;
import com.goaleaf.validators.exceptions.habitsProcessing.MemberDoesNotExistException;
import com.goaleaf.validators.exceptions.habitsProcessing.postsProcessing.EmptyPostException;
import com.goaleaf.validators.exceptions.habitsProcessing.postsProcessing.PostNotFoundException;
import com.goaleaf.validators.exceptions.habitsProcessing.postsProcessing.UserIsNotCreatorException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Objects;

import static com.goaleaf.security.SecurityConstants.SECRET;


@RestController
@RequestMapping(value = "/api/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    @Autowired
    private JwtService jwtService;
    @Autowired
    private PostService postService;
    @Autowired
    private MemberService memberService;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private UserService userService;
    @Autowired
    private ReactionService reactionService;

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public Iterable<Post> getAllHabitPosts(@RequestParam String token, Integer habitID) {

        Claims claims = Jwts.parser()
                .setSigningKey(SECRET.getBytes(StandardCharsets.UTF_8))
                .parseClaimsJws(token).getBody();

        if (!jwtService.Validate(token, SECRET))
            throw new TokenExpiredException("You have to be logged in!");
        if (memberService.findSpecifiedMember(habitID, Integer.parseInt(claims.getSubject())) == null)
            throw new MemberDoesNotExistException("You are not a member!");

        return postService.getAllHabitPosts(habitID);
    }

    @RequestMapping(value = "/addpost", method = RequestMethod.POST)
    public Post addNewPost(@RequestBody NewPostViewModel model) {

        Claims claims = Jwts.parser()
                .setSigningKey(SECRET.getBytes(StandardCharsets.UTF_8))
                .parseClaimsJws(model.token).getBody();

        User tempUser = userService.findById(Integer.parseInt(claims.getSubject()));

        if (!jwtService.Validate(model.token, SECRET))
            throw new TokenExpiredException("You have to be logged in!");
        if (memberService.findSpecifiedMember(model.habitID, Integer.parseInt(claims.getSubject())) == null)
            throw new MemberDoesNotExistException("You are not a member!");
        if (model.postText.isEmpty())
            throw new EmptyPostException("Post cannot be empty!");

        Post newPost = new Post();
        newPost.setHabitID(model.habitID);
        if (model.type == PostTypes.JustText)
            newPost.setPostType(PostTypes.JustText);
        if (model.type == PostTypes.JustPhoto)
            newPost.setPostType(PostTypes.JustPhoto);
        if (model.type == PostTypes.TextAndPhoto)
            newPost.setPostType(PostTypes.TextAndPhoto);
        newPost.setCreatorLogin(tempUser.getLogin());
        newPost.setPostText(model.postText);
        newPost.setDateOfAddition(new Date());

        postService.save(newPost);

//        PostDTO dataToResponse = new PostDTO();
//        dataToResponse.creator = tempUser.getLogin();
//        dataToResponse.text = model.postText;
//        dataToResponse.type = model.type;
//        dataToResponse.dateOfAddition = newPost.getDateOfAddition();

        return newPost;

    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    public HttpStatus removePostFromDatabase(@RequestBody RemovePostViewModel model) {

        Claims claims = Jwts.parser()
                .setSigningKey(SECRET.getBytes(StandardCharsets.UTF_8))
                .parseClaimsJws(model.token).getBody();

        User tempUser = userService.findById(Integer.parseInt(claims.getSubject()));

        if (!jwtService.Validate(model.token, SECRET))
            throw new TokenExpiredException("You have to be logged in!");
        if (memberService.findSpecifiedMember(model.habitID, Integer.parseInt(claims.getSubject())) == null)
            throw new MemberDoesNotExistException("You are not a member!");
        if (postService.findOneByID(model.postID).getCreatorLogin() != tempUser.getLogin())
            throw new UserIsNotCreatorException("You cannot delete posts which were not posted by you");

        postService.removePostFromDatabase(model.postID);
        return HttpStatus.OK;

    }

    @RequestMapping(value = "/post/{id}", method = RequestMethod.PUT)
    public HttpStatus editPost(@RequestBody EditPostViewModel model) {

        Claims claims = Jwts.parser()
                .setSigningKey(SECRET.getBytes(StandardCharsets.UTF_8))
                .parseClaimsJws(model.token).getBody();

        User tempUser = userService.findById(Integer.parseInt(claims.getSubject()));

        if (!jwtService.Validate(model.token, SECRET))
            throw new TokenExpiredException("You have to be logged in!");
        if (memberService.findSpecifiedMember(model.habitID, Integer.parseInt(claims.getSubject())) == null)
            throw new MemberDoesNotExistException("You are not a member!");
        if (postService.findOneByID(model.postID).getCreatorLogin() != tempUser.getLogin())
            throw new UserIsNotCreatorException("You cannot edit posts which were not posted by you");

        Post post = postService.findOneByID(model.postID);
        if (model.type == PostTypes.JustText)
            post.setPostType(PostTypes.JustText);
        if (model.type == PostTypes.JustPhoto)
            post.setPostType(PostTypes.JustPhoto);
        if (model.type == PostTypes.TextAndPhoto)
            post.setPostType(PostTypes.TextAndPhoto);

        post.setPostText(model.text);

        postService.updatePost(post);

        return HttpStatus.OK;
    }

    @RequestMapping(value = "/post/addreaction", method = RequestMethod.POST)
    public PostReactionsNrDTO addReactionToPost(@RequestBody AddReactionViewModel model) {

        Post post = postService.findOneByID(model.postID);
        String pastType = "";

        Claims claims = Jwts.parser()
                .setSigningKey(SECRET.getBytes(StandardCharsets.UTF_8))
                .parseClaimsJws(model.token).getBody();
        User tempUser = userService.getUserById(Integer.parseInt(claims.getSubject()));

        if (!jwtService.Validate(model.token, SECRET))
            throw new TokenExpiredException("You have to be logged in!");
        if (memberService.findSpecifiedMember(post.getHabitID(), Integer.parseInt(claims.getSubject())) == null)
            throw new MemberDoesNotExistException("You are not a member!");
        if (postService.findOneByID(model.postID) == null)
            throw new PostNotFoundException("Post not found");

        if (!(reactionService.getReactionByPostIdAndUserLogin(model.postID, tempUser.getLogin()) == null)) {
            PostReaction reaction = reactionService.getReactionByPostIdAndUserLogin(model.postID, tempUser.getLogin());
            pastType = String.valueOf(reaction.getType()).toUpperCase();
            reactionService.delete(reaction);
            if (Objects.equals(pastType, "CLAPPING"))
                post.setCounter_CLAPPING(post.getCounter_CLAPPING() - 1);
            if (Objects.equals(pastType, "WOW"))
                post.setCounter_WOW(post.getCounter_WOW() - 1);
            if (Objects.equals(pastType, "NOTHING_SPECIAL"))
                post.setCounter_NS(post.getCounter_NS() - 1);
            if (Objects.equals(pastType, "THERES_THE_DOOR"))
                post.setCounter_TTD(post.getCounter_TTD() - 1);
            postService.updatePost(post);
        }
        PostReactionsNrDTO dataToReturn = new PostReactionsNrDTO();
        dataToReturn.counter_CLAPPING = post.getCounter_CLAPPING();
        dataToReturn.counter_NS = post.getCounter_NS();
        dataToReturn.counter_TTD = post.getCounter_TTD();
        dataToReturn.counter_WOW = post.getCounter_WOW();


        if (Objects.equals(model.type, pastType))
            return dataToReturn;

        PostReaction newReaction = new PostReaction();
        newReaction.setPostID(model.postID);
        newReaction.setType(model.type);
        newReaction.setUserLogin(tempUser.getLogin());

        if (Objects.equals(model.type, "CLAPPING"))
            post.setCounter_CLAPPING(post.getCounter_CLAPPING() + 1);
        if (Objects.equals(model.type, "WOW"))
            post.setCounter_WOW(post.getCounter_WOW() + 1);
        if (Objects.equals(model.type, "NOTHING_SPECIAL"))
            post.setCounter_NS(post.getCounter_NS() + 1);
        if (Objects.equals(model.type, "THERES_THE_DOOR"))
            post.setCounter_TTD(post.getCounter_TTD() + 1);

        reactionService.add(newReaction);
        postService.updatePost(post);

        dataToReturn.counter_CLAPPING = post.getCounter_CLAPPING();
        dataToReturn.counter_NS = post.getCounter_NS();
        dataToReturn.counter_TTD = post.getCounter_TTD();
        dataToReturn.counter_WOW = post.getCounter_WOW();

        return dataToReturn;
    }

    @RequestMapping(value = "/presentreaction", method = RequestMethod.GET)
    public PostReaction getUsersPresentReaction(@RequestParam Integer postID, @RequestParam String userLogin) throws AccountNotExistsException {
        if (postService.findOneByID(postID) == null)
            throw new PostNotFoundException("Post not found");
        if (userService.findByLogin(userLogin) == null) {
            throw new AccountNotExistsException("Account with this login not exists!");
        }

        return reactionService.getReactionByPostIdAndUserLogin(postID, userLogin);
    }
}
